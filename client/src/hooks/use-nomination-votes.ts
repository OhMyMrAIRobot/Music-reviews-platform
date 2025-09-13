import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NominationAPI } from '../api/nomination-api'
import { INominationCandidatesResponse } from '../models/nomination/nomination-candidate/nomination-candidates-response'
import { NominationEntityKind } from '../models/nomination/nomination-entity-kind'
import { INominationType } from '../models/nomination/nomination-type/nomination-type'
import { INominationUserVote } from '../models/nomination/nomination-user-vote'

export function useNominationVotes(isAuth: boolean) {
	const queryClient = useQueryClient()

	const { data: nominationTypes = [], isPending: isTypesLoading } = useQuery<
		INominationType[]
	>({
		queryKey: ['nominationTypes'],
		queryFn: () => NominationAPI.fetchNominationTypes(),
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
	})

	const { data: candidates, isPending: isCandidatesLoading } =
		useQuery<INominationCandidatesResponse>({
			queryKey: ['nominationCandidates'],
			queryFn: () => NominationAPI.fetchCandidates(),
			staleTime: 1000 * 60 * 5,
		})

	const { data: userVotes = [], isPending: isVotesLoading } = useQuery<
		INominationUserVote[]
	>({
		queryKey: ['nominationUserVotes'],
		queryFn: () => NominationAPI.fetchUserVotes(),
		enabled: isAuth,
		staleTime: 1000 * 60,
	})

	const voteMutation = useMutation<
		INominationUserVote,
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
			queryClient.setQueryData<INominationUserVote[] | undefined>(
				['nominationUserVotes'],
				prev => (prev ? [...prev, newVote] : [newVote])
			)
		},
	})

	const postVote = async (
		nominationTypeId: string,
		entityKind: NominationEntityKind,
		entityId: string
	): Promise<string[]> => {
		try {
			await voteMutation.mutateAsync({ nominationTypeId, entityKind, entityId })
			return []
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return Array.isArray(e?.response?.data?.message)
				? e.response.data.message
				: [e?.response?.data?.message ?? 'Не удалось отправить голос']
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
