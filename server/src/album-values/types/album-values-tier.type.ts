export type AlbumValueTier =
  | 'silver'
  | 'gold'
  | 'emerald'
  | 'sapphire'
  | 'ruby';

export const ALBUM_VALUE_TIERS: readonly AlbumValueTier[] = [
  'silver',
  'gold',
  'emerald',
  'sapphire',
  'ruby',
] as const;

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
