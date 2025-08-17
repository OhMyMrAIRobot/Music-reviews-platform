import { AuthorType, UserFavAuthor } from '@prisma/client';

export class AuthorDetailsResponseDto {
  id: string;
  img: string;
  cover: string;
  name: string;
  favCount: number;
  userFavAuthor: UserFavAuthor[];
  authorTypes: AuthorType[];
  isRegistered: boolean;
  releaseTypeRatings: {
    type: string;
    ratings: {
      withoutText: number | null;
      withText: number | null;
      media: number | null;
    };
  }[];
}
