import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { TitleAndTextTogether } from '../../decorators/title-and-text-together.decorator';
import { CreateReviewRequestDto } from './create-review.request.dto';

/**
 * UpdateReviewRequestDto
 *
 * Partial request for updating a review. Inherits the same validation
 * rules as `CreateReviewRequestDto` but all fields are optional.
 */
export class UpdateReviewRequestDto extends PartialType(
  CreateReviewRequestDto,
) {
  /** Internal helper field used by the `TitleAndTextTogether` decorator */
  @Exclude()
  @TitleAndTextTogether()
  update_titleAndTextValidation?: boolean;
}
