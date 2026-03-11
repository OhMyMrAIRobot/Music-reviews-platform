import { AuthorCommentsQuery } from '../types/author';

export const authorCommentsKeys = {
  all: ['authorComments'] as const,
  list: (params: AuthorCommentsQuery) => ['authorComments', params] as const,
};
