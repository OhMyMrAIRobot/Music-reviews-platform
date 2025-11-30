import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

/**
 * Request DTO for updating a release media item (partial update).
 *
 * Both `title` and `url` are optional — provide only fields that need
 * to be changed.
 */
export class UpdateReleaseMediaRequestDto {
  /** Optional new title for the media item (10-100 characters). */
  @IsOptional()
  @IsString({ message: 'Заголовок должен быть строкой!' })
  @Length(10, 100, {
    message: 'Заголовок должен быть длиной от 10 до 100 символов!',
  })
  title?: string;

  /** Optional new URL for the media item (1-255 characters). */
  @IsOptional()
  @IsUrl({}, { message: 'URL должен быть корректным!' })
  @Length(1, 255, {
    message: 'URL должен быть длиной от 1 до 255 символов!',
  })
  url?: string;
}
