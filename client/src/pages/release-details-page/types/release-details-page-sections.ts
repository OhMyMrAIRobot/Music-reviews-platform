export const ReleaseDetailsPageSectionId = {
  REVIEW: 'REVIEW',
  MARK: 'MARK',
  MEDIAREVIEW: 'MEDIAREVIEW',
  ALBUM_VALUE: 'ALBUM_VALUE',
} as const;

export type ReleaseDetailsPageSectionId =
  (typeof ReleaseDetailsPageSectionId)[keyof typeof ReleaseDetailsPageSectionId];
