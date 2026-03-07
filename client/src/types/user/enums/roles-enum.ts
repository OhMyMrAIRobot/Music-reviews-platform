/**
 * RolesEnum
 *
 * Available user roles in the system.
 */
export enum RolesEnum {
  USER = "Пользователь",
  MEDIA = "Медиа",
  ADMIN = "Администратор",
  ROOT_ADMIN = "Гл. Администратор",
}

/**
 * AdminAvailableRolesEnum
 *
 * Roles that can be assigned by an Admin.
 */
export enum AdminAvailableRolesEnum {
  USER = "Пользователь",
  MEDIA = "Медиа",
}

/**
 * RootAdminAvalaibleRolesEnum
 *
 * Roles that can be assigned by a Root admin.
 */
export enum RootAdminAvalaibleRolesEnum {
  USER = "Пользователь",
  MEDIA = "Медиа",
  ADMIN = "Администратор",
}
