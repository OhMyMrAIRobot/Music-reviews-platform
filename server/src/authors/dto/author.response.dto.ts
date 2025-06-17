export class AuthorResponseDto {
  id: string;
  img: string;
  cover: string;
  name: string;
  likes_count: number;
  user_fav_ids: { userId: string | null; authorId: string | null }[];
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

export class QueryAuthorResponseDto extends Array<AuthorResponseDto> {}
