/**
 * AuthorConfirmationStatusesEnum
 *
 * Labels representing the confirmation workflow for
 * authors. These enum members are used in API responses, validation and
 * admin interfaces to indicate whether an author's confirmation is
 * pending, approved or rejected.
 */
export enum AuthorConfirmationStatusesEnum {
  PENDING = 'Ожидание',
  APPROVED = 'Принято',
  REJECTED = 'Отклонено',
}
