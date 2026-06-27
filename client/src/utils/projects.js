export function formatProjectDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getProjectPath(slug) {
  return `/projects/${slug}`;
}

export function hasLiveLink(project) {
  return project?.links?.live && project.links.live !== '#';
}

export function hasGithubLink(project) {
  return project?.links?.github && project.links.github !== '#';
}
