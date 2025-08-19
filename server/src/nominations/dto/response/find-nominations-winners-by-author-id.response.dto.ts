import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

class AuthorDto {
  id: string;
  name: string;
  avatarImg: string;
  coverImg: string;
}

class ReleaseDto {
  id: string;
  title: string;
  img: string;
  artists: string[];
  producers: string[];
  designers: string[];
}

class NominationItemDto {
  nominationTypeId: string;
  nominationType: string;
  year: number;
  month: number;
  entityKind: NominationEntityKind;
  entityId: string;
  votes: number;
  author: AuthorDto;
  release: ReleaseDto;
}

export class FindNominationWinnersByAuthorIdResponseDto {
  authorId: string;
  nominations: NominationItemDto[];
}
