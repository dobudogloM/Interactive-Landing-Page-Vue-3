export const IMAGE_URL = process.env.VUE_APP_BASE_IMAGE_URL || "";

export function getImagePath(path?: string): string {
  if (!path) return "";
  return IMAGE_URL + path.replace(/^\/+/, "");
}
