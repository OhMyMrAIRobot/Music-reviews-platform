import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string, field: string, value: string | number) {
    super(`${entity} с ${field}: '${value}' не найден(а)!`);
  }
}
