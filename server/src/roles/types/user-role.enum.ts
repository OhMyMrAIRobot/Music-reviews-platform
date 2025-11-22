/**
 * UserRoleEnum
 *
 * Role labels used by the application. These enum
 * members represent the canonical set of user roles and should be used
 * when seeding, comparing or returning role values from the API.
 */
export enum UserRoleEnum {
  /** Regular user with default privileges. */
  USER = 'Пользователь',

  /** Media user with permissions related to content/media management. */
  MEDIA = 'Медиа',

  /** Administrator with elevated management permissions. */
  ADMIN = 'Администратор',

  /** Root administrator with the highest level of permissions. */
  ROOT_ADMIN = 'Гл. Администратор',
}
