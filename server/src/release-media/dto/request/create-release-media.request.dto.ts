import { IsString, IsUrl, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * Request DTO for creating release media (client-facing payload).
 *
 * This DTO is validated for incoming requests and includes basic
 * constraints for `title`, `url` and `releaseId`.
 */
export class CreateReleaseMediaRequestDto {
  /** Title shown for the media item (10-100 characters). */
  @IsString({ message: 'Заголовок должен быть строкой!' })
  @Length(10, 100, {
    message: 'Заголовок должен быть длиной от 10 до 100 символов!',
  })
  title: string;

  /** Link to the media; must be a valid URL (5-255 characters). */
  @IsUrl({}, { message: 'URL должен быть корректным!' })
  @Length(5, 255, {
    message: 'URL должен быть длиной от 5 до 255 символов!',
  })
  url: string;

  /** Target release id that this media belongs to. */
  @IsEntityId()
  releaseId: string;
}
