import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { TitleAndTextTogether } from '../decorators/title-and-text-together.decorator';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @Exclude()
  @TitleAndTextTogether()
  update_titleAndTextValidation?: boolean;
}
