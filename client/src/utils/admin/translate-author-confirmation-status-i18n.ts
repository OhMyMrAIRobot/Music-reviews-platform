import type { TFunction } from 'i18next';
import { AuthorConfirmationStatusesEnum } from '../../types/author/enums/author-confirmation-statuses-enum';
import { AuthorConfirmationStatusesFilterOptions } from '../../types/author/helpers/filter';
import { resolveBackendEnumKey } from '../i18n/resolve-backend-enum-key';

export function translateAuthorConfirmationStatus(
  t: TFunction,
  status: string
): string {
  const key = resolveBackendEnumKey(AuthorConfirmationStatusesEnum, status);
  if (key !== undefined) {
    return t(`enums.authorConfirmationStatus.${String(key)}`);
  }
  return t('adminDashboard.common.unknown');
}

export function translateAuthorConfirmationStatusesFilterLabel(
  t: TFunction,
  option: string
): string {
  if (option === AuthorConfirmationStatusesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  return translateAuthorConfirmationStatus(t, option);
}
