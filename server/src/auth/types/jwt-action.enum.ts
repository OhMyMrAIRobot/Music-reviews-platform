/**
 * Enumerates the short-lived JWT action token kinds used by the system.
 *
 * - `ACTIVATION`: token sent to new users to activate their account
 * - `RESET_PASSWORD`: token used to authorize password reset flows
 */
export enum JwtActionEnum {
  /** Activation token for new accounts */
  ACTIVATION = 'activation',

  /** Token for resetting a user's password */
  RESET_PASSWORD = 'reset',
}
