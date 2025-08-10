import { AuthorCommentResponseDto } from './author-comment.response.dto';

export class FindAuthorCommentsResponseDto {
  count: number;
  comments: AuthorCommentResponseDto[];
}
