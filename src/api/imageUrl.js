const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'https://benbenssmartcars.alwaysdata.net';

export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_URL}${path}`;
}
