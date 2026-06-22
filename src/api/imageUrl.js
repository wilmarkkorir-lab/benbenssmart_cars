export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://benbenssmartcars.alwaysdata.net${path}`;
}
