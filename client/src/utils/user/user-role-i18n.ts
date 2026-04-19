import type { TFunction } from 'i18next';
import { RolesEnum, RolesFilterOptions } from '../../types/user';

export function translateUserRole(t: TFunction, role: string): string {
  switch (role) {
    case RolesEnum.USER:
      return t('user.role.user');
    case RolesEnum.MEDIA:
      return t('user.role.media');
    case RolesEnum.ADMIN:
      return t('user.role.admin');
    default:
      return role;
  }
}

export function translateRolesFilterOption(
  t: TFunction,
  option: string
): string {
  if (option === RolesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  return translateUserRole(t, option);
}
