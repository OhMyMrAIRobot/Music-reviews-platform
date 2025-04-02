import { PartialType } from '@nestjs/mapped-types';
import { CreateReleaseRatingTypeDto } from './create-release-rating-type.dto';

export class UpdateReleaseRatingTypeDto extends PartialType(
  CreateReleaseRatingTypeDto,
) {}
