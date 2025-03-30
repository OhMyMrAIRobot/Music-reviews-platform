import { ConflictException } from '@nestjs/common';

export class EntityInUseException extends ConflictException {
  constructor(entity: string, field: string, value: string | number) {
    super(`${entity} с ${field}: '${value} всё еще используется!`);
  }
}
