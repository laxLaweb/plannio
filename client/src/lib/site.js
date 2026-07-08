export const SITE_URL = "https://plannio.app";

export function absoluteUrl(path) {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
