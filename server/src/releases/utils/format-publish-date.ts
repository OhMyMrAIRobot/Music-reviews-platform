export function formatPublishDate(date: Date): string {
  if (!date) return '';

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
