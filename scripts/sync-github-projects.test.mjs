import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProjectManifest } from './sync-github-projects.mjs';

const repo = { full_name: 'syahmiaof/sample-project' };
const activeManifest = {
  slug: 'sample-project',
  title: 'Sample Project',
  subtitle: 'A concise summary.',
  status: 'active',
  description: 'A public project with a clear scope.',
  stack: ['React', 'TypeScript'],
  liveUrl: 'https://example.com',
  image: 'public/og-image.jpg',
};

test('normalizes an active project and keeps its public links', () => {
  const project = parseProjectManifest(repo, activeManifest);
  assert.equal(project.slug, 'github-sample-project');
  assert.equal(project.github, 'https://github.com/syahmiaof/sample-project');
  assert.equal(project.status, 'active');
  assert.equal(project.image, 'public/og-image.jpg');
  assert.equal(project.featured, false);
});

test('requires scoped development notes for ongoing projects', () => {
  const project = parseProjectManifest(repo, {
    ...activeManifest,
    status: 'in-development',
    stage: 'Prototype',
    scope: ['Dashboard'],
    developmentNote: 'Still in development; this is a public prototype.',
  });
  assert.equal(project.stage, 'Prototype');
  assert.deepEqual(project.scope, ['Dashboard']);
});

test('rejects unsafe image paths and non-HTTPS project URLs', () => {
  assert.throws(() => parseProjectManifest(repo, { ...activeManifest, image: 'public/../secret.jpg' }), /safe repository-relative path/);
  assert.throws(() => parseProjectManifest(repo, { ...activeManifest, liveUrl: 'http://example.com' }), /HTTPS URL/);
});

test('rejects unsupported project status and repeated stack entries', () => {
  assert.throws(() => parseProjectManifest(repo, { ...activeManifest, status: 'experiment' }), /status.*active.*in-development/);
  assert.throws(() => parseProjectManifest(repo, { ...activeManifest, stack: ['React', 'react'] }), /duplicate values/);
});
