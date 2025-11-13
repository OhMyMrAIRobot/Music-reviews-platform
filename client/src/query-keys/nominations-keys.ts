export const nominationsKeys = {
	all: ['nominations'] as const,
	byAuthor: (authorId: string) => ['nominations', 'byAuthor', authorId] as const,
}
