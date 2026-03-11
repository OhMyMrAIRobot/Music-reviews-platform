import axios from 'axios';
import {
  AuthEmailSentStatusResponse,
  AuthResponse,
  AuthResponseWithEmailStatus,
  LoginData,
  RegisterData,
  ResetPasswordData,
  SendResetPasswordData,
} from '../types/auth';
import { api } from './api-instance';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const _api = axios.create({
  baseURL: `${SERVER_URL}/auth/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * API service for authentication-related operations.
 * Provides methods for user login, registration, logout, password reset, account activation,
 * and token refresh functionality.
 */
export const AuthAPI = {
  /**
   * Refreshes the user's access token using the refresh token stored in cookies.
   *
   * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response containing new tokens.
   */
  async refresh(): Promise<AuthResponse> {
    const { data } = await _api.post<AuthResponse>('refresh');
    return data;
  },

  /**
   * Authenticates a user with email and password.
   *
   * @param {LoginData} formData - The login credentials including email and password.
   * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response with tokens.
   */
  async login(formData: LoginData): Promise<AuthResponse> {
    const { data } = await _api.post<AuthResponse>('login', formData);
    return data;
  },

  /**
   * Logs out the current user by invalidating the session.
   */
  async logout() {
    return _api.post('logout');
  },

  /**
   * Registers a new user account.
   *
   * @param {RegisterData} formData - The registration data including email, password, and other user details.
   * @returns {Promise<AuthResponseWithEmailStatus>} A promise that resolves to the authentication response with email verification status.
   */
  async register(formData: RegisterData): Promise<AuthResponseWithEmailStatus> {
    const { data } = await _api.post<AuthResponseWithEmailStatus>(
      'register',
      formData
    );
    return data;
  },

  /**
   * Sends a password reset email to the specified email address.
   *
   * @param {SendResetPasswordData} formData - The data containing the email address for password reset.
   * @returns {Promise<AuthEmailSentStatusResponse>} A promise that resolves to the response indicating if the email was sent successfully.
   */
  async sendResetPassword(
    formData: SendResetPasswordData
  ): Promise<AuthEmailSentStatusResponse> {
    const { data } = await _api.post<AuthEmailSentStatusResponse>(
      'send-reset-password',
      formData
    );
    return data;
  },

  /**
   * Activates a user account using an activation token.
   *
   * @param {string} token - The activation token received via email.
   * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response after activation.
   */
  async activate(token: string): Promise<AuthResponse> {
    const { data } = await _api.post<AuthResponse>(`activate?token=${token}`);
    return data;
  },

  /**
   * Resets the user's password using a reset token.
   *
   * @param {ResetPasswordData} formData - The data containing the reset token and new password.
   * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response after password reset.
   */
  async resetPassword(formData: ResetPasswordData): Promise<AuthResponse> {
    const { data } = await _api.post<AuthResponse>(
      `reset-password?token=${formData.token}`,
      {
        password: formData.password,
      }
    );
    return data;
  },

  /**
   * Resends the account activation email to the current user.
   *
   * @returns {Promise<AuthEmailSentStatusResponse>} A promise that resolves to the response indicating if the email was sent successfully.
   */
  async resendActivation(): Promise<AuthEmailSentStatusResponse> {
    const { data } = await api.post<AuthEmailSentStatusResponse>(
      'auth/resend-activation'
    );
    return data;
  },
};
