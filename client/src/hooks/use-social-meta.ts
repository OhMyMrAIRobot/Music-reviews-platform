import { useQuery } from '@tanstack/react-query'
import { SocialMediaAPI } from '../api/social-media-api'

export function useSocialMeta() {
	const {
		data: socials,
		isPending,
		isError,
	} = useQuery({
		queryKey: ['socials'],
		queryFn: () => SocialMediaAPI.fetchSocials(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		socials: socials ?? [],
		isLoading: isPending,
		isError,
	}
}
