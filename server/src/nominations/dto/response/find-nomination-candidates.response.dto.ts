import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

class CandidateDto {
  id: string;
  title: string;
  img: string;
  entityKind: NominationEntityKind;
}

export class FindNominationCandidatesResponseDto {
  year: number;
  month: number;
  startDate: string;
  endDate: string;

  albumCandidates: CandidateDto[];
  singleCandidates: CandidateDto[];
  artistCandidates: CandidateDto[];
  designerCandidates: CandidateDto[];
  producerCandidates: CandidateDto[];
}
