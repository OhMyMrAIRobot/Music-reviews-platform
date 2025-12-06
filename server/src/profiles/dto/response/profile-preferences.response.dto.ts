/**
 * Response DTO with the profile's preferences.
 *
 * The DTO with user's preferences grouped into categories such as
 * `artists`, `producers`, `tracks` and `albums`.
 */
export type ProfilePreferencesResponseDto = {
  /** User unique identifier */
  userId: string;

  /** List of favorite artists */
  artists: ProfilePreference[];

  /** List of favorite producers */
  producers: ProfilePreference[];

  /** List of favorite tracks */
  tracks: ProfilePreference[];

  /** List of favorite albums */
  albums: ProfilePreference[];
};

/**
 * Minimal representation of a profile preference item.
 */
type ProfilePreference = {
  /** Entity id (author or release id depending on the category) */
  id: string;

  /** Display name of the preference item */
  name: string;

  /** Image filename or URL associated with the item */
  img: string;
};
