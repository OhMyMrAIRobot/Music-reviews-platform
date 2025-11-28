import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NominationAPI } from '../api/nomination-api'
import { NominationEntityKind, NominationUserVote } from '../types/nomination'
import { useApiErrorHandler } from './use-api-error-handler'

export function useNominationVotes(isAuth: boolean) {
	const handleApiError = useApiErrorHandler()

	const queryClient = useQueryClient()

	const { data: nominationTypes = [], isPending: isTypesLoading } = useQuery({
		queryKey: ['nominationTypes'],
		queryFn: () => NominationAPI.fetchNominationTypes(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	const { data: candidates, isPending: isCandidatesLoading } = useQuery({
		queryKey: ['nominationCandidates'],
		queryFn: () => NominationAPI.findCandidates(),
		staleTime: 1000 * 60 * 5,
	})

	const { data: userVotes = [], isPending: isVotesLoading } = useQuery({
		queryKey: ['nominationUserVotes'],
		queryFn: () => NominationAPI.findUserVotes(),
		enabled: isAuth,
		staleTime: 1000 * 60,
	})

	const voteMutation = useMutation<
		NominationUserVote,
		unknown,
		{
			nominationTypeId: string
			entityKind: NominationEntityKind
			entityId: string
		}
	>({
		mutationFn: vars =>
			NominationAPI.postVote(
				vars.nominationTypeId,
				vars.entityKind,
				vars.entityId
			),
		onSuccess: newVote => {
			queryClient.setQueryData<NominationUserVote[] | undefined>(
				['nominationUserVotes'],
				prev => (prev ? [...prev, newVote] : [newVote])
			)
		},
	})

	const postVote = async (
		nominationTypeId: string,
		entityKind: NominationEntityKind,
		entityId: string
	) => {
		try {
			await voteMutation.mutateAsync({ nominationTypeId, entityKind, entityId })
		} catch (error: unknown) {
			handleApiError(error, 'Не удалось отправить голос!')
		}
	}

	return {
		candidates,
		userVotes,
		nominationTypes,
		postVote,
		isLoading: isCandidatesLoading || isVotesLoading || isTypesLoading,
	}
}
