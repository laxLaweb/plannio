export const SITE_URL = "https://plannio.eu";

export const SITE_OWNER = {
  name: "Laweb",
  cvr: "29076561",
};

export function formatSiteOwner() {
  return `${SITE_OWNER.name} (CVR ${SITE_OWNER.cvr})`;
}

export function absoluteUrl(path) {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
