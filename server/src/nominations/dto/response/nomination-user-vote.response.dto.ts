import { NominationType, NominationVote } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

/**
 * DTO returned when a user's vote for a nomination is requested.
 *
 * The class uses `class-transformer` decorators to expose only the
 * serialized fields that are meaningful to API consumers. Internal
 * storage fields such as `authorId` and `releaseId` are excluded and
 * replaced by a computed `entityId` and `entityKind`.
 */
export class NominationUserVoteResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  nominationType: NominationType;

  @Expose()
  month: number;

  @Expose()
  year: number;

  /** Internal storage for authorId (excluded from serialized output) */
  @Exclude()
  authorId?: string;

  /** Internal storage for releaseId (excluded from serialized output) */
  @Exclude()
  releaseId?: string;

  /**
   * The id of the nominated entity (authorId or releaseId). Computed from
   * the underlying Prisma `NominationVote` record at transformation time.
   */
  @Expose()
  @Transform(({ obj }: { obj: NominationVote }) => {
    if (obj.authorId !== null) {
      return obj.authorId;
    } else if (obj.releaseId !== null) {
      return obj.releaseId;
    } else {
      return '';
    }
  })
  entityId: string;

  /**
   * The kind of the nominated entity. Computed at transformation time and
   * returned as the union `'author' | 'release'`.
   */
  @Expose()
  @Transform(({ obj }: { obj: NominationVote }) => {
    return obj.authorId !== null ? 'author' : 'release';
  })
  entityKind: NominationEntityKind;

  @Expose()
  createdAt: Date;

  /** Internal nomination type id (excluded from serialized output) */
  @Exclude()
  nominationTypeId: string;
}
