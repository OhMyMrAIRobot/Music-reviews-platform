/**
 * Tier identifiers used to categorize aggregated album values.
 *
 * Each tier corresponds to a numeric range defined in
 * `ALBUM_VALUE_TIER_RANGES` and is used by consumers to filter or label
 * computed album value results.
 */
export type AlbumValueTier =
  | 'silver'
  | 'gold'
  | 'emerald'
  | 'sapphire'
  | 'ruby';

/** Ordered list of all possible album value tiers. */
export const ALBUM_VALUE_TIERS: readonly AlbumValueTier[] = [
  'silver',
  'gold',
  'emerald',
  'sapphire',
  'ruby',
] as const;

/**
 * Numeric boundaries used to map a computed total value to a tier.
 *
 * Values are inclusive of `min` and `max` ranges and represent the human
 * readable ranges for each tier.
 */
export const ALBUM_VALUE_TIER_RANGES: Record<
  AlbumValueTier,
  { min: number; max: number }
> = {
  silver: { min: 0, max: 5.99 },
  gold: { min: 6, max: 11.99 },
  emerald: { min: 12, max: 17.99 },
  sapphire: { min: 18, max: 23.99 },
  ruby: { min: 24, max: 30 },
};
