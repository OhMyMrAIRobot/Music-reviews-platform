export function formatUserCreatedAt(date: Date): string {
  if (!date) return '';

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
