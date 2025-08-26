import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

interface CandidateBaseDto {
  id: string;
  img: string;
  entityKind: NominationEntityKind;
}

interface ReleaseCandidateDto extends CandidateBaseDto {
  title: string;
  entityKind: 'release';
  authors: string[];
}

interface AuthorCandidateDto extends CandidateBaseDto {
  name: string;
  entityKind: 'author';
}

type CandidateDto = ReleaseCandidateDto | AuthorCandidateDto;

export class FindNominationCandidatesResponseDto {
  year: number;
  month: number;
  startDate: string;
  endDate: string;

  albumCandidates: CandidateDto[];
  singleCandidates: CandidateDto[];
  coverCandidates: CandidateDto[];
  artistCandidates: CandidateDto[];
  producerCandidates: CandidateDto[];
}
