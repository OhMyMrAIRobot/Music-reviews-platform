import { ConflictException } from '@nestjs/common';

/**
 * Exception thrown when a duplicate field value is detected during entity creation.
 *
 * Extends NestJS ConflictException to provide a standardized error response
 * for conflicts arising from unique constraint violations.
 */
export class DuplicateFieldException extends ConflictException {
  /**
   * Creates a new DuplicateFieldException with a descriptive message.
   *
   * @param entity - The name of the entity (e.g., 'User', 'Release')
   * @param field - The field name that has the duplicate value (e.g., 'email', 'nickname')
   * @param value - The duplicate value that caused the conflict
   */
  constructor(entity: string, field: string, value: string | number) {
    super(`${entity} с ${field} '${value}' уже существует!`);
  }
}
