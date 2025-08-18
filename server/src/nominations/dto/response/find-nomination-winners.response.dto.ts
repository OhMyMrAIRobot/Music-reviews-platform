export type NominationEntityKind = 'author' | 'release';

interface NominationAuthorDto {
  id: string;
  name: string;
  avatarImg: string;
  coverImg: string;
}

interface NominationReleaseDto {
  id: string;
  title: string;
  img: string;
  authors: string[];
}

interface NominationWinnerBaseDto {
  type: string;
  votes: number;
  entityId: string;
  entityKind: NominationEntityKind;
}

interface AuthorWinnerItemDto extends NominationWinnerBaseDto {
  entityKind: 'author';
  author: NominationAuthorDto;
  release?: never;
}

interface ReleaseWinnerItemDto extends NominationWinnerBaseDto {
  entityKind: 'release';
  release: NominationReleaseDto;
  author?: never;
}

type NominationWinnerItemDto = AuthorWinnerItemDto | ReleaseWinnerItemDto;

export interface FindNominationWinnersResponseDto {
  year: number;
  month: number;
  results: NominationWinnerItemDto[];
}
