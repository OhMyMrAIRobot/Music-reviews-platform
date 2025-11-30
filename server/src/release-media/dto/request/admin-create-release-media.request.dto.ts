import { IsString, IsUrl, Length } from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * Administrative request DTO for creating release media.
 *
 * Admins may additionally set type and status fields when creating a
 * media entry.
 */
export class AdminCreateReleaseMediaRequestDto {
  /** Title shown for the media item (10-100 characters). */
  @IsString({ message: 'Заголовок должен быть строкой!' })
  @Length(10, 100, {
    message: 'Заголовок должен быть длиной от 10 до 100 символов!',
  })
  title: string;

  /** Link to the media; must be a valid URL (1-255 characters). */
  @IsUrl({}, { message: 'URL должен быть корректным!' })
  @Length(1, 255, {
    message: 'URL должен быть длиной от 1 до 255 символов!',
  })
  url: string;

  /** Target release id that this media belongs to. */
  @IsEntityId()
  releaseId: string;

  /** Explicit media type id (admin-only). */
  @IsEntityId()
  releaseMediaTypeId: string;

  /** Explicit media status id (admin-only). */
  @IsEntityId()
  releaseMediaStatusId: string;
}
