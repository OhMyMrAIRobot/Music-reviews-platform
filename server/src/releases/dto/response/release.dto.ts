import { NominationTypesEnum } from 'src/nomination-types/types/nomination-types.enum';

/**
 * ReleaseType: brief information about the release type.
 */
type ReleaseType = {
  id: string;
  type: string;
};

/**
 * ReleaseAuthor: compact author information.
 */
type ReleaseAuthor = {
  id: string;
  name: string;
  img: string;
};

/**
 * UserFavRelease: relation representing a user favoriting a release.
 */
type UserFavRelease = {
  userId: string;
  releaseId: string;
};

/**
 * TotalRatings: aggregated rating counts per rating type.
 */
type TotalRatings = {
  type: string;
  total: number;
};

/**
 * DetailRatings: detailed rating values by criteria.
 */
type DetailRatings = {
  type: string;
  details: {
    rhymes: number;
    structure: number;
    atmosphere: number;
    realization: number;
    individuality: number;
  };
};

/**
 * ReleaseDto — canonical API response for a single release.
 * Fields match the JSON structure produced by the centralized raw SQL query.
 */
export type ReleaseDto = {
  id: string;
  title: string;
  img: string;
  releaseType: ReleaseType;
  /** Publication date in ISO format */
  publishDate: string;
  authors: {
    artists: ReleaseAuthor[];
    designers: ReleaseAuthor[];
    producers: ReleaseAuthor[];
  };
  userFavRelease: UserFavRelease[];
  ratings: {
    total: TotalRatings[];
    details: DetailRatings[];
  };
  reviewsInfo: {
    withText: number;
    withoutText: number;
  };
  nominationTypes: NominationTypesEnum[];
  hasAuthorLikes: boolean;
  hasAuthorComments: boolean;
  /** Record creation timestamp (ISO) */
  createdAt: string;
};
