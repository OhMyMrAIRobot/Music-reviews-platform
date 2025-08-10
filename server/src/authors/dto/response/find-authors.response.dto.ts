export class FindAuthorsResponseDto {
  count: number;
  authors: AuthorQueryResponse[];
}

export class AuthorQueryResponse {
  id: string;
  img: string;
  name: string;
  favCount: number;
  authorTypes: { id: string; type: string }[];
  releaseTypeRatings: [
    {
      type: string;
      ratings: {
        withoutText: number | null;
        withText: number | null;
        media: number | null;
      };
    },
  ];
  isRegistered: boolean;
}
