import { Controller } from '@nestjs/common';
import { RegisteredAuthorsService } from './registered-authors.service';

@Controller('registered-authors')
export class RegisteredAuthorsController {
  constructor(private readonly registeredAuthorsService: RegisteredAuthorsService) {}
}
