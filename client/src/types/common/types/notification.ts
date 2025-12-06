/**
 * Interface representing a notification object used for displaying messages to the user.
 */
export interface INotification {
	/**
	 * Unique identifier for the notification.
	 */
	id: string

	/**
	 * The text content of the notification.
	 */
	text: string

	/**
	 * Indicates whether the notification represents an error (true) or a success/info message (false).
	 */
	isError: boolean
}
