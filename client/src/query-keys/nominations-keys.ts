import { NominationWinnersQuery } from "../types/nomination";

export const nominationsKeys = {
  types: ["nominationTypes"] as const,
  candidates: ["nominationCandidates"] as const,
  userVotes: (userId: string) => ["nominationUserVotes", userId] as const,
  all: ["nominations"] as const,
  winners: (params: NominationWinnersQuery) =>
    ["nominations", "winners", params] as const,
  byAuthor: (authorId: string) =>
    ["nominations", "byAuthor", authorId] as const,
};
