import { AuthorLikesQuery } from '../types/review';

export const authorLikesKeys = {
  all: ['authorLikes'] as const,
  list: (params: AuthorLikesQuery) => ['authorLikes', 'list', params] as const,
};
