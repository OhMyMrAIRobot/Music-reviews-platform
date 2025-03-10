import { ForbiddenException } from '@nestjs/common';

export class InsufficientPermissionsException extends ForbiddenException {
  constructor() {
    super('You do not have permission to access this resource');
  }
}