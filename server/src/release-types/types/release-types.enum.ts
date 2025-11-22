/**
 * ReleaseTypesEnum
 *
 * Human-readable release type labels used across the API and UI.
 * Each enum member maps to a localized (Russian) label stored in the
 * database and used in responses. Use these values when you need to
 * display or compare release types in server-side code.
 */
export enum ReleaseTypesEnum {
  ALBUM = 'Альбом',
  SINGLE = 'Трек',
}
