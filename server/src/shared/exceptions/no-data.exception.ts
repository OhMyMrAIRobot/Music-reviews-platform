import { BadRequestException } from '@nestjs/common';

/**
 * Exception thrown when a request lacks required data or parameters.
 *
 * Extends NestJS BadRequestException to provide a standardized error response
 * for incomplete or empty request payloads.
 */
export class NoDataProvidedException extends BadRequestException {
  /**
   * Creates a new NoDataProvidedException with a standard message.
   */
  constructor() {
    super('Данные не предоставлены!');
  }
}
