import { Exclude, Expose, Transform, Type } from 'class-transformer';

/**
 * DTOs used to serialize user data returned by the API.
 *
 * This file contains a set of small helper DTOs and the exported
 * `UserDto`, `UserWithPasswordDto` and `UserDetailsDto` shapes used
 * across user-related controllers and services.
 */

/**
 * Role DTO
 *
 * Represents a user's role metadata attached to user responses.
 */
class Role {
  @Expose()
  id: string;

  @Expose()
  role: string;
}

/**
 * Profile DTO
 *
 * A lightweight representation of a user's profile that flattens
 * related social media entries into a `socialMedia` array.
 */
class Profile {
  @Exclude()
  id: string;

  @Expose()
  avatar: string;

  @Expose()
  coverImage: string;

  @Expose()
  bio?: string;

  @Exclude()
  points: number;

  @Exclude()
  userId: string;

  @Expose()
  @Transform(({ obj }: { obj: ProfileWithSocial }) => {
    return (
      obj.socialMedia?.map((item) => ({
        id: item.social.id,
        name: item.social.name,
        url: item.url,
      })) || []
    );
  })
  socialMedia: Social[];
}

/**
 * Serialized social media item used in profile responses.
 */
class Social {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  url: string;
}

type SocialItem = {
  social: {
    id: string;
    name: string;
  };
  url: string;
};

type ProfileWithSocial = {
  socialMedia?: SocialItem[];
};

/**
 * BaseUserDto
 *
 * Shared user fields returned in API responses. This base class is
 * extended by other exported DTOs to avoid duplication of common
 * properties and transformation metadata.
 */
class BaseUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  @Type(() => Role)
  role: Role;

  @Expose()
  @Type(() => RegisteredAuthor)
  registeredAuthor: RegisteredAuthor[];

  @Exclude()
  roleId: string;
}

/**
 * Public user DTO.
 *
 * Contains publicly visible fields for a user and intentionally
 * excludes sensitive information such as `password`.
 */
export class UserDto extends BaseUserDto {
  @Exclude()
  password: string;
}

/**
 * Internal DTO including password.
 *
 * Extends `BaseUserDto` and exposes `password`. Use this DTO only in
 * internal flows where the password must be present.
 */
export class UserWithPasswordDto extends BaseUserDto {
  @Expose()
  password: string;
}

/**
 * Detailed user DTO including profile information.
 *
 * This DTO is used when a full user object including the nested
 * `profile` is required.
 */
export class UserDetailsDto extends BaseUserDto {
  @Expose()
  @Type(() => Profile)
  profile: Profile | null;
}

/**
 * Registered author relation DTO
 *
 * Represents a link between a user and a registered author entity.
 */
class RegisteredAuthor {
  @Exclude()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  authorId: string;

  @Exclude()
  createdAt: string;
}
