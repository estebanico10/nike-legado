/**
 * Resolves a relative asset path (like './assets/...') to an absolute path
 * that takes the Vite base URL (e.g. /nike-legado/) into account.
 * 
 * @param {string} path - The relative asset path
 * @returns {string} The resolved absolute asset path
 */
export function resolveAsset(path) {
  if (!path) return "";
  
  // If it's already an absolute URL or a data URL, return it as is
  if (
    path.startsWith("http://") || 
    path.startsWith("https://") || 
    path.startsWith("data:")
  ) {
    return path;
  }
  
  // Remove leading './' or '.' if present
  const cleanPath = path.replace(/^\.?\/+/, "");
  
  // Get base URL from Vite
  const base = import.meta.env.BASE_URL || "/";
  
  // Ensure base ends with a slash and cleanPath doesn't start with one
  const safeBase = base.endsWith("/") ? base : `${base}/`;
  
  return `${safeBase}${cleanPath}`;
}
