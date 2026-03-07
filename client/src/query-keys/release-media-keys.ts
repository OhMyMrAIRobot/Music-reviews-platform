import { ReleaseMediaQuery } from "../types/release";

export const releaseMediaKeys = {
  types: ["releaseMediaTypes"] as const,
  statuses: ["releaseMediaStatuses"] as const,
  all: ["releaseMedia"] as const,
  list: (params: ReleaseMediaQuery) =>
    ["releaseMedia", "list", params] as const,
};
