import { NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when an entity cannot be found with the specified field and value.
 *
 * Extends NestJS NotFoundException to provide a standardized error response
 * for missing entity scenarios.
 */
export class EntityNotFoundException extends NotFoundException {
  /**
   * Creates a new EntityNotFoundException with a descriptive message.
   *
   * @param entity - The name of the entity that was not found (e.g., 'User', 'Release')
   * @param field - The field name used in the lookup (e.g., 'id', 'email')
   * @param value - The value that was searched for
   */
  constructor(entity: string, field: string, value: string | number) {
    super(`${entity} с ${field}: '${value}' не найден(а)!`);
  }
}
