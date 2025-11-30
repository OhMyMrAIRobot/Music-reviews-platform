import { User } from '../../user'

/**
 * Response returned after a successful authentication requests.
 */
export type AuthResponse = {
	user: User
	accessToken: string
}

/**
 * Response indicating whether an email was successfully sent.
 */
export type AuthEmailSentStatusResponse = {
	emailSent: boolean
}

/**
 * Combined response containing authentication details
 * and email sent status.
 */
export type AuthResponseWithEmailStatus = AuthResponse &
	AuthEmailSentStatusResponse
