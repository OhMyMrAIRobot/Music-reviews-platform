export const ProfilePageSectionId = {
  AUTHOR_CARDS: 'AUTHOR_CARDS',
  PREFER: 'PREFER',
  REVIEWS: 'REVIEWS',
  MEDIA_REVIEWS: 'MEDIA_REVIEWS',
  LIKES: 'LIKES',
} as const;

export type ProfilePageSectionId =
  (typeof ProfilePageSectionId)[keyof typeof ProfilePageSectionId];
