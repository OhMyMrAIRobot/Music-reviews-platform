import { PartialType } from '@nestjs/mapped-types';
import { CreateReleaseDto } from './create-release.dto';

export class UpdateReleaseDto extends PartialType(CreateReleaseDto) {}
