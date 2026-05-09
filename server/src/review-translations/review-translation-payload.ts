export type ReviewFieldsForTranslation = {
  title: string;
  text: string;
};

export function buildTranslationPayload(
  review: ReviewFieldsForTranslation,
): string {
  return JSON.stringify({
    title: review.title,
    text: review.text,
  });
}

export function sanitizeTranslatedPayload(raw: string): string {
  let s = raw;
  if (s.charCodeAt(0) === 0xfeff) {
    s = s.slice(1);
  }
  return s.trim();
}

export type ParsedTranslationFields = {
  title: string;
  text: string;
};

export function parseTranslatedPayload(
  sanitized: string,
): ParsedTranslationFields {
  const parsed: unknown = JSON.parse(sanitized);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('invalid_translation_payload');
  }
  const obj = parsed as Record<string, unknown>;
  const title = obj.title;
  const text = obj.text;
  if (typeof title !== 'string' || typeof text !== 'string') {
    throw new Error('invalid_translation_fields');
  }
  return { title, text };
}
