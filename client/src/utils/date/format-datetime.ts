import i18n from '../../i18n/i18n';

function resolveLocale(locale?: string): string {
  if (locale) return locale.split('-')[0] ?? locale;
  const lng = i18n.resolvedLanguage ?? i18n.language;
  return lng?.split('-')[0] ?? 'en';
}

export function formatPublishDate(iso: string, locale?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(iso: string, locale?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
