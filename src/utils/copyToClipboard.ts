export function copyToClipboard(value: string): Promise<void> {
  return navigator.clipboard.writeText(value);
}
