export function formatAlbumValueSliderRange(
  template: string,
  min: number,
  max: number
): string {
  return template
    .replace(/\{\{min\}\}/g, String(min))
    .replace(/\{\{max\}\}/g, String(max));
}
