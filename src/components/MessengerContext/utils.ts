export function getCurrentHashValue() {
  const hash = window.location.hash;
  if (!hash) return "";
  return hash.slice(1);
}
