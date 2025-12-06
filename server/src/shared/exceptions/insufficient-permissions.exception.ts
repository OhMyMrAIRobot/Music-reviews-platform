import { ForbiddenException } from '@nestjs/common';

/**
 * Exception thrown when a user attempts to access a resource without sufficient permissions.
 *
 * Extends NestJS ForbiddenException to provide a standardized error response
 * for authorization failures.
 */
export class InsufficientPermissionsException extends ForbiddenException {
  /**
   * Creates a new InsufficientPermissionsException with a standard message.
   */
  constructor() {
    super('Недостаточно прав для доступа к ресурсу!');
  }
}
