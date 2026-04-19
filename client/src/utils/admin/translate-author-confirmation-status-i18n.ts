import type { TFunction } from 'i18next';
import { AuthorConfirmationStatusesEnum } from '../../types/author/enums/author-confirmation-statuses-enum';
import { AuthorConfirmationStatusesFilterOptions } from '../../types/author/helpers/filter';

export function translateAuthorConfirmationStatus(
  t: TFunction,
  status: AuthorConfirmationStatusesEnum | string
): string {
  if (status === AuthorConfirmationStatusesEnum.PENDING)
    return t('adminDashboard.authorConfirmationStatus.pending');
  if (status === AuthorConfirmationStatusesEnum.APPROVED)
    return t('adminDashboard.authorConfirmationStatus.approved');
  if (status === AuthorConfirmationStatusesEnum.REJECTED)
    return t('adminDashboard.authorConfirmationStatus.rejected');
  return t('adminDashboard.common.unknown');
}

export function translateAuthorConfirmationStatusesFilterLabel(
  t: TFunction,
  option: string
): string {
  if (option === AuthorConfirmationStatusesFilterOptions.ALL) {
    return t('adminDashboard.common.all');
  }
  if (
    option === AuthorConfirmationStatusesFilterOptions.PENDING ||
    option === AuthorConfirmationStatusesEnum.PENDING
  ) {
    return translateAuthorConfirmationStatus(
      t,
      AuthorConfirmationStatusesEnum.PENDING
    );
  }
  if (
    option === AuthorConfirmationStatusesFilterOptions.APPROVED ||
    option === AuthorConfirmationStatusesEnum.APPROVED
  ) {
    return translateAuthorConfirmationStatus(
      t,
      AuthorConfirmationStatusesEnum.APPROVED
    );
  }
  if (
    option === AuthorConfirmationStatusesFilterOptions.REJECTED ||
    option === AuthorConfirmationStatusesEnum.REJECTED
  ) {
    return translateAuthorConfirmationStatus(
      t,
      AuthorConfirmationStatusesEnum.REJECTED
    );
  }
  return option;
}
