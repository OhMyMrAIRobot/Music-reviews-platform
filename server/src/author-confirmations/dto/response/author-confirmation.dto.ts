import { Exclude, Expose, Transform, Type } from 'class-transformer';

/** Minimal shape of a user's profile used for response serialization. */
type UserProfileLite = { avatar: string };

/**
 * Minimal user shape used when serializing nested user information.
 *
 * The DTO `User` below maps fields from this structure and exposes a
 * computed `avatar` property.
 */
type UserLite = {
  id: string;
  nickname: string;
  profile?: UserProfileLite | null;
};

/** Status representation attached to an author confirmation. */
class Status {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

/** Minimal author representation used inside the confirmation response. */
class Author {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  img: string;
}

/**
 * Public-facing user representation nested on the confirmation DTO.
 *
 * `avatar` is computed from the underlying `profile` object when present.
 */
class User {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  @Transform(({ obj }: { obj: UserLite }) => obj.profile?.avatar ?? '')
  avatar: string;
}

/**
 * Response DTO for a single author confirmation.
 *
 * Exposes the public fields used by API consumers and hides internal ids
 * (`userId`, `authorId`, `statusId`) via `@Exclude()` to avoid leaking
 * relation ids in the serialized payload.
 */
export class AuthorConfirmationDto {
  /** Confirmation unique identifier. */
  @Expose()
  id: string;

  /** Text of the confirmation. */
  @Expose()
  confirmation: string;

  /** ISO timestamp when the confirmation was created. */
  @Expose()
  createdAt: string;

  /** Nested user information for the confirmation author. */
  @Expose()
  @Type(() => User)
  user: User;

  /** Nested author information being confirmed. */
  @Expose()
  @Type(() => Author)
  author: Author;

  /** Current status object for the confirmation (e.g. pending/approved). */
  @Expose()
  @Type(() => Status)
  status: Status;

  @Exclude()
  userId: string;

  @Exclude()
  authorId: string;

  @Exclude()
  statusId: string;
}
