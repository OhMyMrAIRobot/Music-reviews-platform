import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { TitleAndTextTogether } from '../../decorators/title-and-text-together.decorator';
import { CreateReviewRequestDto } from './create-review.request.dto';

export class UpdateReviewRequestDto extends PartialType(
  CreateReviewRequestDto,
) {
  @Exclude()
  @TitleAndTextTogether()
  update_titleAndTextValidation?: boolean;
}
