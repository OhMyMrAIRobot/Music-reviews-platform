export class FindAuthorResponseDto {
  id: string;
  img: string;
  cover: string;
  name: string;
  favCount: number;
  userFavAuthors: { userId: string; authorId: string }[];
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
}

export class QueryFindAuthorResponseDto extends Array<FindAuthorResponseDto> {}
