/**
 * Payload for user registration request.
 *
 * Contains the minimal required information to create a new user
 * record.
 */
export type RegisterData = {
  /** Email address for the new user */
  email: string;

  /** Desired nickname for the user */
  nickname: string;

  /** Password for the new user */
  password: string;
};

/**
 * Payload for user login request.
 */
export type LoginData = {
  /** User email address used for authentication */
  email: string;

  /** User password used for authentication */
  password: string;
};

/**
 * Payload for resetting a user's password.
 */
export type ResetPasswordData = {
  /** JWT token used for password reset */
  token: string;

  /** New password for the user */
  password: string;
};

/**
 * Payload for request sending a reset password code
 * to a provided user's email.
 */
export type SendResetPasswordData = {
  email: string;
};
