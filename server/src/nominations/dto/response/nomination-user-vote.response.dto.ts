import { NominationType, NominationVote } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

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

  @Exclude()
  authorId?: string;

  @Exclude()
  releaseId?: string;

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

  @Expose()
  @Transform(({ obj }: { obj: NominationVote }) => {
    return obj.authorId !== null ? 'author' : 'release';
  })
  entityKind: NominationEntityKind;

  @Expose()
  createdAt: Date;

  @Exclude()
  nominationTypeId: string;
}
