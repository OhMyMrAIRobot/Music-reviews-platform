import type { TFunction } from 'i18next';
import { UserStatusesEnum } from '../../types/user';

export function translateUserStatus(t: TFunction, status: string): string {
  switch (status) {
    case UserStatusesEnum.ACTIVE:
      return t('adminDashboard.userStatus.active');
    case UserStatusesEnum.NON_ACTIVE:
      return t('adminDashboard.userStatus.inactive');
    default:
      return status;
  }
}
