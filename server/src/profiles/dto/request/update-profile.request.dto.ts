import {
  plainToClass,
  Transform,
  TransformFnParams,
  Type,
} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { IsEntityId } from 'src/shared/decorators/is-entity-id.decorator';

/**
 * DTO for updating a user profile.
 *
 * All fields are optional to allow partial updates.
 * Supports updating the biography and clearing avatar/cover images.
 */
export class UpdateProfileRequestDto {
  /**
   * Optional short biography for the profile (0-255 characters).
   */
  @IsOptional()
  @IsString({ message: 'Описание профиля должно быть строкой!' })
  @Length(0, 255, {
    message: 'Описание профиля не должно превышать 255 символов!',
  })
  bio?: string;

  /**
   * When true the stored avatar will be cleared for the profile.
   */
  @IsOptional()
  @IsBoolean({ message: 'Поле clearAvatar должно быть булевым значением!' })
  @Type(() => Boolean)
  clearAvatar?: boolean;

  /**
   * When true the stored cover image will be cleared for the profile.
   */
  @IsOptional()
  @IsBoolean({ message: 'Поле clearCover должно быть булевым значением!' })
  @Type(() => Boolean)
  clearCover?: boolean;

  /**
   * Optional array of social media entries to add/update/remove.
   *
   * Each item must include a `socialId` (id from the `Social_media` table).
   * If `url` is provided and non-empty the entry will be created or
   * updated; if `url` is omitted or an empty string the entry will be
   * deleted when present.
   */
  @IsOptional()
  @IsArray()
  @Transform(
    ({ value }: TransformFnParams): unknown => {
      let parsed: unknown;
      if (typeof value === 'string') {
        try {
          parsed = JSON.parse(value) as unknown;
        } catch {
          parsed = value;
        }
      } else {
        parsed = value;
      }
      if (Array.isArray(parsed)) {
        return (parsed as unknown[]).map((item) =>
          plainToClass(ProfileSocialItemDto, item as Record<string, unknown>),
        );
      }
      return parsed;
    },
    { toClassOnly: true },
  )
  @Type(() => ProfileSocialItemDto)
  @ValidateNested({ each: true })
  socials?: ProfileSocialItemDto[];
}

/**
 * Model describing a single social media update operation inside the
 * `UpdateProfileRequestDto.socials` array.
 */
class ProfileSocialItemDto {
  /** Social network unique identifier */
  @IsEntityId()
  socialId: string;

  /**
   * Target URL for the social profile. When provided the service will
   * create or update the corresponding `ProfileSocialMedia` record. When
   * omitted or empty the service will remove the record if it exists.
   */
  @IsOptional()
  @IsUrl({}, { message: 'Поле url должно быть корректным URL!' })
  url?: string;
}
