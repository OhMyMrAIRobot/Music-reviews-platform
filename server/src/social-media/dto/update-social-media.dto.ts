import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialMediaDto } from './create-social-media.dto';

export class UpdateSocialMediaDto extends PartialType(CreateSocialMediaDto) {}
