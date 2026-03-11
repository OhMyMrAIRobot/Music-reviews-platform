export const profilesKeys = {
  all: ['profiles'] as const,
  profile: (id: string) => ['profiles', id] as const,
  preferences: (userId: string) => ['profiles', 'preferences', userId] as const,
};
