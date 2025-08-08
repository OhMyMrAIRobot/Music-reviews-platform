import { ConflictException } from '@nestjs/common';

export class DuplicateFieldException extends ConflictException {
  constructor(entity: string, field: string, value: string | number) {
    super(`${entity} с ${field} '${value}' уже существует!`);
  }
}
