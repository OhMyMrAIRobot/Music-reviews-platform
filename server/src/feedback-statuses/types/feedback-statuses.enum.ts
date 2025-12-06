/**
 * FeedbackStatusesEnum
 *
 * Labels representing the state of user feedback
 * items. These values are used in API responses and server-side
 * validation to indicate whether a piece of feedback is new, already
 * read, or has been answered by staff.
 */
export enum FeedbackStatusesEnum {
  NEW = 'Новое',
  READ = 'Прочитано',
  ANSWERED = 'Отвечено',
}
