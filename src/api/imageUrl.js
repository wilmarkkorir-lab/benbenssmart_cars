const BASE_URL = 'https://benbenssmartcars.alwaysdata.net';

export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}
