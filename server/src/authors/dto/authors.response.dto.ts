export class AuthorsResponseDto {
  count: number;
  authors: AuthorQueryResponse[];
}

export class AuthorQueryResponse {
  id: string;
  img: string;
  name: string;
  likes_count: number;
  author_types: { id: string; type: string }[];
  release_type_stats: [
    {
      type: string;
      ratings: {
        no_text: number | null;
        with_text: number | null;
        super_user: number | null;
      };
    },
  ];
}
