import { AuthorType } from '@prisma/client';

/**
 * AuthorCommentDto — canonical API response for a single author comment.
 * Fields match the JSON structure produced by the raw SQL query used by
 * the author-comments listing endpoints.
 */
export type AuthorCommentDto = {
  id: string;
  title: string;
  text: string;
  user: User;
  release: Release;
  author: Author;
  /** Creation timestamp in ISO format */
  createdAt: string;
};

/**
 * User — compact user information included with an author comment.
 */
type User = {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
  rank: number | null;
};

/**
 * Release — brief release information included with an author comment.
 */
type Release = {
  id: string;
  title: string;
  img: string;
};

/**
 * Author — summary information about the author (types and aggregates).
 */
type Author = {
  type: AuthorType[];
  totalComments: number;
  totalAuthorLikes: number;
};
