import { ReleasesQuery } from '../types/release'

export const releasesKeys = {
	types: ['releaseTypes'] as const,
	all: ['releases'] as const,
	details: (id: string) => ['release', id] as const,
	list: (params: ReleasesQuery) => ['releases', 'list', params] as const,
}
