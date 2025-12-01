import { useQuery } from '@tanstack/react-query'
import { SocialMediaAPI } from '../api/social-media-api'
import { socialMediaKeys } from '../query-keys/social-media-keys'

/**
 * Custom hook to fetch and manage social media metadata.
 * This hook uses React Query to retrieve the list of available social media platforms,
 * caching the data indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing social media metadata:
 * - `socials`: Array of social media platforms (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if the data is currently being fetched.
 */
export function useSocialMeta() {
	const { data: socials = [], isPending } = useQuery({
		queryKey: socialMediaKeys.socials,
		queryFn: () => SocialMediaAPI.findAll(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	return {
		socials: socials,
		isLoading: isPending,
	}
}
