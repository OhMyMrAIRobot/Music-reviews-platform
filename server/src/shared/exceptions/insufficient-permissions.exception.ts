import { ForbiddenException } from '@nestjs/common';

export class InsufficientPermissionsException extends ForbiddenException {
  constructor() {
    super('Недостаточно прав для доступа к ресурсу!');
  }
}
