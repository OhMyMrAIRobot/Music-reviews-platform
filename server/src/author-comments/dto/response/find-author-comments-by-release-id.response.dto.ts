import { AuthorType } from '@prisma/client';

export class FindAuthorCommentsByReleaseIdResponseDto {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  userId: string;
  authorTypes: AuthorType[];
  nickname: string;
  avatar: string;
  totalComments: number;
  releaseId: string;
  releaseImg: string;
  points: number;
  position: number | null;
}
