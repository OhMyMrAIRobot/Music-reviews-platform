import { UnauthorizedException } from '@nestjs/common';

/**
 * Exception thrown when a JWT token is invalid, expired, or malformed.
 *
 * Extends NestJS UnauthorizedException to provide a standardized error response
 * for token validation failures.
 */
export class InvalidTokenException extends UnauthorizedException {
  /**
   * Creates a new InvalidTokenException with a standard message.
   */
  constructor() {
    super('Токен истёк или недействителен!');
  }
}
