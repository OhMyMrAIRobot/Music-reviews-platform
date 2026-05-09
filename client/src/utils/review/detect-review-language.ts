import { ReviewLanguagesEnum } from '../../types/review/enums/review-languages-enum';

const MAX_SAMPLE = 2000;

function isLatinCodePoint(cp: number): boolean {
  return (cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a);
}

function isCyrillicCodePoint(cp: number): boolean {
  return cp >= 0x0400 && cp <= 0x04ff;
}

export function detectReviewLanguage(
  title: string | null,
  text: string | null
): ReviewLanguagesEnum {
  const combined = [title, text].filter(Boolean).join('\n');
  const sample = combined.slice(0, MAX_SAMPLE);

  let cyrillicCount = 0;
  let latinCount = 0;

  for (const ch of sample) {
    const cp = ch.codePointAt(0);
    if (cp === undefined) continue;
    if (isCyrillicCodePoint(cp)) cyrillicCount += 1;
    else if (isLatinCodePoint(cp)) latinCount += 1;
  }

  if (cyrillicCount > latinCount) return ReviewLanguagesEnum.RU;
  return ReviewLanguagesEnum.EN;
}
