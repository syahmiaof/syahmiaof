import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_BASE = 'https://api.github.com';
const TOPIC = 'portfolio-showcase';
const MAX_MANIFEST_BYTES = 24 * 1024;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function fail(repoName, message) {
  throw new Error(`${repoName}: ${message}`);
}

function requireText(value, field, repoName, maxLength = 300) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    fail(repoName, `portfolio.json field "${field}" must be a non-empty string up to ${maxLength} characters.`);
  }
  return value.trim();
}

function requireHttpsUrl(value, field, repoName) {
  const text = requireText(value, field, repoName, 2048);
  let url;
  try {
    url = new URL(text);
  } catch {
    fail(repoName, `portfolio.json field "${field}" must be a valid HTTPS URL.`);
  }
  if (url.protocol !== 'https:' || url.username || url.password) {
    fail(repoName, `portfolio.json field "${field}" must be a public HTTPS URL without embedded credentials.`);
  }
  return url.href;
}

function requireStringList(value, field, repoName, { min = 1, max = 10, itemLength = 60 } = {}) {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    fail(repoName, `portfolio.json field "${field}" must contain ${min}-${max} strings.`);
  }
  const result = value.map((item) => requireText(item, field, repoName, itemLength));
  if (new Set(result.map((item) => item.toLowerCase())).size !== result.length) {
    fail(repoName, `portfolio.json field "${field}" cannot contain duplicate values.`);
  }
  return result;
}

export function parseProjectManifest(repo, raw) {
  const repoName = repo.full_name;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    fail(repoName, 'portfolio.json must contain a JSON object.');
  }

  const sourceSlug = requireText(raw.slug, 'slug', repoName, 50);
  if (!SLUG_PATTERN.test(sourceSlug)) {
    fail(repoName, 'portfolio.json field "slug" may use lowercase letters, numbers, and single hyphens only.');
  }
  if (!['active', 'in-development'].includes(raw.status)) {
    fail(repoName, 'portfolio.json field "status" must be "active" or "in-development".');
  }

  const project = {
    slug: `github-${sourceSlug}`,
    title: requireText(raw.title, 'title', repoName, 90),
    subtitle: requireText(raw.subtitle, 'subtitle', repoName, 140),
    status: raw.status,
    description: requireText(raw.description, 'description', repoName, 700),
    stack: requireStringList(raw.stack, 'stack', repoName, { max: 12, itemLength: 45 }),
    github: `https://github.com/${repo.full_name}`,
    featured: false,
    sourceRepo: repo.full_name,
  };

  if (raw.liveUrl !== undefined) project.liveUrl = requireHttpsUrl(raw.liveUrl, 'liveUrl', repoName);
  if (raw.image !== undefined) {
    const imagePath = requireText(raw.image, 'image', repoName, 180);
    const parts = imagePath.split('/');
    if (imagePath.startsWith('/') || imagePath.includes('\\') || parts.some((part) => !part || part === '.' || part === '..')) {
      fail(repoName, 'portfolio.json field "image" must be a safe repository-relative path.');
    }
    if (!/^public\/(?:[a-zA-Z0-9._-]+\/)*[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp)$/i.test(imagePath)) {
      fail(repoName, 'portfolio.json field "image" must point to a JPG, PNG, or WebP file under public/.');
    }
    project.image = imagePath;
  }

  if (raw.status === 'in-development') {
    project.stage = requireText(raw.stage, 'stage', repoName, 140);
    project.scope = requireStringList(raw.scope, 'scope', repoName, { max: 8, itemLength: 100 });
    project.developmentNote = requireText(raw.developmentNote, 'developmentNote', repoName, 700);
    if (!project.liveUrl) fail(repoName, 'in-development projects must include a liveUrl for the public prototype.');
  }

  return project;
}

async function requestJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'syahmiaof-portfolio-project-sync',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub API request failed (${response.status}) for ${url}`);
  return response.json();
}

async function requestRawManifest(repo) {
  const url = `https://raw.githubusercontent.com/${repo.full_name}/${encodeURIComponent(repo.default_branch)}/portfolio.json`;
  const response = await fetch(url, { headers: { 'User-Agent': 'syahmiaof-portfolio-project-sync' } });
  if (!response.ok) fail(repo.full_name, `portfolio.json is required for the ${TOPIC} opt-in (HTTP ${response.status}).`);
  const body = await response.text();
  if (Buffer.byteLength(body, 'utf8') > MAX_MANIFEST_BYTES) fail(repo.full_name, 'portfolio.json exceeds the 24 KB limit.');
  try {
    return JSON.parse(body);
  } catch {
    fail(repo.full_name, 'portfolio.json is not valid JSON.');
  }
}

async function fetchPreview(repo, project) {
  if (!project.image) return null;
  const imageUrl = `https://raw.githubusercontent.com/${repo.full_name}/${encodeURIComponent(repo.default_branch)}/${project.image}`;
  const response = await fetch(imageUrl, { headers: { 'User-Agent': 'syahmiaof-portfolio-project-sync' } });
  if (!response.ok) fail(repo.full_name, `preview image could not be downloaded (HTTP ${response.status}).`);

  const mime = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  const extension = IMAGE_TYPES.get(mime);
  if (!extension) fail(repo.full_name, 'preview image must be JPG, PNG, or WebP.');
  const declaredSize = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_IMAGE_BYTES) fail(repo.full_name, 'preview image must be between 1 byte and 4 MB.');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) fail(repo.full_name, 'preview image must be between 1 byte and 4 MB.');

  return { filename: `${project.slug}.${extension}`, bytes };
}

export async function collectProjects({ owner = 'syahmiaof' } = {}) {
  const repos = [];
  for (let page = 1; page <= 20; page += 1) {
    const batch = await requestJson(`${API_BASE}/users/${encodeURIComponent(owner)}/repos?type=public&sort=updated&per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error('GitHub repository list response was not an array.');
    repos.push(...batch);
    if (batch.length < 100) break;
    if (page === 20) throw new Error('GitHub repository scan exceeded the 2,000-repository safety limit.');
  }

  const eligible = repos
    .filter((repo) => repo.visibility === 'public' && !repo.private && !repo.archived && !repo.fork && repo.owner?.login?.toLowerCase() === owner.toLowerCase())
    .filter((repo) => Array.isArray(repo.topics) && repo.topics.includes(TOPIC))
    .sort((a, b) => a.full_name.localeCompare(b.full_name));

  const projects = [];
  const previews = [];
  const slugs = new Set();
  for (const repo of eligible) {
    const project = parseProjectManifest(repo, await requestRawManifest(repo));
    if (slugs.has(project.slug)) fail(repo.full_name, `duplicate portfolio slug "${project.slug}".`);
    slugs.add(project.slug);
    projects.push(project);
    const preview = await fetchPreview(repo, project);
    if (preview) previews.push(preview);
  }

  return { projects, previews };
}

export async function writeGeneratedProjects({ projects, previews }, { root = ROOT } = {}) {
  const generatedJson = path.resolve(root, 'src', 'data', 'github-projects.generated.json');
  const imageDirectory = path.resolve(root, 'public', 'images', 'github-projects');
  await mkdir(imageDirectory, { recursive: true });

  const keep = new Set(previews.map((preview) => preview.filename));
  const existing = await readdir(imageDirectory, { withFileTypes: true });
  for (const entry of existing) {
    if (entry.isFile() && /\.(?:jpe?g|png|webp)$/i.test(entry.name) && !keep.has(entry.name)) {
      await rm(path.join(imageDirectory, entry.name));
    }
  }
  for (const preview of previews) {
    await writeFile(path.join(imageDirectory, preview.filename), preview.bytes);
  }

  const normalized = projects.map((project) => {
    const { image: sourceImage, ...rest } = project;
    if (!sourceImage) return rest;
    const preview = previews.find((candidate) => candidate.filename.startsWith(`${project.slug}.`));
    if (!preview) fail(project.sourceRepo, 'preview image was not available in the sync result.');
    return { ...rest, image: `/images/github-projects/${path.basename(preview.filename)}` };
  });
  await writeFile(generatedJson, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return { count: normalized.length, imageCount: previews.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await collectProjects({ owner: process.env.GITHUB_PROJECT_OWNER || 'syahmiaof' });
    const summary = await writeGeneratedProjects(result);
    console.log(`Synced ${summary.count} opted-in public projects and ${summary.imageCount} preview images.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Project sync failed.');
    process.exitCode = 1;
  }
}
