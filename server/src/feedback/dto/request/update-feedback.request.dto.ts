import { IsNotEmpty, IsString } from 'class-validator';
import { IsEntityId } from 'src/decorators/is-entity-id.decorator';

export class UpdateFeedbackRequestDto {
  @IsString({ message: 'Статус должен быть строкой' })
  @IsNotEmpty({ message: 'Статус не должен быть пустым' })
  @IsEntityId()
  feedbackStatusId: string;
}
