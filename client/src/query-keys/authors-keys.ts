import { AuthorsQuery } from "../types/author";

export const authorsKeys = {
  types: ["authorTypes"] as const,
  all: ["authors"] as const,
  list: (params: AuthorsQuery) => ["authors", params] as const,
  details: (id: string) => ["authors", "details", id] as const,
};
