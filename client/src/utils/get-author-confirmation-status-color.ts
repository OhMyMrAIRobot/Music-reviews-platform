import { AuthorConfirmationStatusesEnum } from '../types/author';
import { resolveBackendEnumKey } from './i18n/resolve-backend-enum-key';

export const getAuthorConfirmationStatusColor = (status: string): string => {
  const key = resolveBackendEnumKey(AuthorConfirmationStatusesEnum, status);
  switch (key) {
    case 'APPROVED':
      return 'text-green-600';
    case 'PENDING':
      return 'text-yellow-600';
    case 'REJECTED':
      return 'text-red-600';
    default:
      return '';
  }
};
