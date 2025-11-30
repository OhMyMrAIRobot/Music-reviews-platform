import { UnauthorizedException } from '@nestjs/common';

/**
 * Exception thrown when user authentication fails due to invalid credentials.
 *
 * Extends NestJS UnauthorizedException to provide a standardized error response
 * for authentication failures.
 */
export class InvalidCredentialsException extends UnauthorizedException {
  /**
   * Creates a new InvalidCredentialsException with a standard message.
   */
  constructor() {
    super('Неверные данные!');
  }
}
