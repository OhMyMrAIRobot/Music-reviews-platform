/**
 * ReleaseMediaStatusesEnum
 *
 * Human-readable labels representing the workflow/status of media
 * items attached to releases. These values are used in API responses
 * and server-side validations. Use enum members when comparing or
 * returning media status values.
 */
export enum ReleaseMediaStatusesEnum {
  PENDING = 'Ожидание',
  APPROVED = 'Принято',
  REJECTED = 'Отклонено',
}
