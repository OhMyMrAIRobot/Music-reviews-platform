import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorTypeDto } from './create-author-type.dto';

export class UpdateAuthorTypeDto extends PartialType(CreateAuthorTypeDto) {}
