import { ConflictException } from '@nestjs/common';

export class DuplicateFieldException extends ConflictException {
  constructor(entity: string, field: string, value: string | number) {
    super(`${entity} with ${field} '${value}' already exists!`);
  }
}
