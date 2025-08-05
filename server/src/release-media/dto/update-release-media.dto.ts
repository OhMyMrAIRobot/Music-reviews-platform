import { PartialType } from '@nestjs/mapped-types';
import { CreateReleaseMediaDto } from './create-release-media.dto';

export class UpdateReleaseMediaDto extends PartialType(CreateReleaseMediaDto) {}
