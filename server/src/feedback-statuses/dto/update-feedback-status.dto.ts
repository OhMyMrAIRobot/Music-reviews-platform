import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackStatusDto } from './create-feedback-status.dto';

export class UpdateFeedbackStatusDto extends PartialType(
  CreateFeedbackStatusDto,
) {}
