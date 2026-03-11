import { ReleaseType } from '..';
import { ReleaseTypesFilterOptions } from './filter';

/**
 * Return release type id by UI option. Returns null for 'ALL'.
 */
export function getTypeIdByOption(
  option: ReleaseTypesFilterOptions | string,
  types?: ReleaseType[] | null
): string | undefined {
  if (option === ReleaseTypesFilterOptions.ALL) return undefined;
  const found = types?.find((t) => t.type === option);
  return found?.id ?? undefined;
}
