import { BadRequestException } from '@nestjs/common';

export class NoDataProvidedException extends BadRequestException {
  constructor() {
    super('No data provided!');
  }
}
