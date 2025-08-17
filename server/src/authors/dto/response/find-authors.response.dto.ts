import { AuthorDetailsResponseDto } from './author-details.response.dto';

export class FindAuthorsResponseDto {
  count: number;
  authors: AuthorDetailsResponseDto[];
}
