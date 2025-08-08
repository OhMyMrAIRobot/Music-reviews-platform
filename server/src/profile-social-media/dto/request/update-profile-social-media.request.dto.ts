import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileSocialMediaRequestDto } from './create-profile-social-media.request.dto';

export class UpdateProfileSocialMediaRequestDto extends PartialType(
  CreateProfileSocialMediaRequestDto,
) {}
