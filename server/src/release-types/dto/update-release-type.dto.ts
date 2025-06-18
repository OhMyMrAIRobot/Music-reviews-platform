import { PartialType } from '@nestjs/mapped-types';
import { CreateReleaseTypeDto } from './create-release-type.dto';

export class UpdateReleaseTypeDto extends PartialType(CreateReleaseTypeDto) {}
