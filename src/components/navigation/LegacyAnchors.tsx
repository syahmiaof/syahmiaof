'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ongoingProjects } from '@/data/projects';
import { workExperiences } from '@/data/experience';

// Preserve bookmarked anchors whose full content has moved off the homepage.
const destinations: Record<string, string> = {
  '#stack': '/skills#stack', '#capabilities': '/skills#capabilities',
  '#lab': '/lab', '#intelligence': '/lab#intelligence',
  '#collaboration': '/experience#collaboration', '#awards': '/credentials#awards',
  ...Object.fromEntries(ongoingProjects.map(project => [`#${project.slug}`, `/projects#${project.slug}`])),
  ...Object.fromEntries(workExperiences.map(role => [`#experience-${role.id}`, `/experience#experience-${role.id}`])),
};
export function LegacyAnchors() {
  const router = useRouter();
  useEffect(() => {
    const resolve = () => { const target = destinations[window.location.hash]; if (target) router.replace(target); };
    resolve(); window.addEventListener('hashchange', resolve);
    return () => window.removeEventListener('hashchange', resolve);
  }, [router]);
  return null;
}
