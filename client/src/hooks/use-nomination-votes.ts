import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NominationAPI } from "../api/nomination-api";
import { nominationsKeys } from "../query-keys/nominations-keys";
import { NominationEntityKind, NominationUserVote } from "../types/nomination";
import { useApiErrorHandler } from "./use-api-error-handler";
import { useStore } from "./use-store";

/**
 * Custom hook for managing nomination votes, including fetching nomination types, candidates, user votes,
 * and providing a function to submit new votes.
 * This hook integrates with React Query for data fetching and caching, and MobX for user authentication state.
 *
 * @returns An object containing nomination data and utilities:
 * - `candidates`: Array of nomination candidates (or undefined if not loaded).
 * - `userVotes`: Array of user's votes (defaults to empty array if not loaded).
 * - `nominationTypes`: Array of nomination types (defaults to empty array if not loaded).
 * - `postVote`: Function to submit a vote for a nomination.
 * - `isLoading`: Boolean indicating if any of the data is currently loading.
 */
export const useNominationVotes = () => {
  const { authStore } = useStore();

  const handleApiError = useApiErrorHandler();

  const queryClient = useQueryClient();

  const { data: nominationTypes = [], isPending: isTypesLoading } = useQuery({
    queryKey: nominationsKeys.types,
    queryFn: () => NominationAPI.fetchNominationTypes(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: candidates, isPending: isCandidatesLoading } = useQuery({
    queryKey: nominationsKeys.candidates,
    queryFn: () => NominationAPI.findCandidates(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: userVotes = [], isLoading: isVotesLoading } = useQuery({
    queryKey: nominationsKeys.userVotes(authStore.user?.id ?? "unknown"),
    queryFn: () => NominationAPI.findUserVotes(),
    enabled: authStore.isAuth && !!authStore.user,
    staleTime: 1000 * 60,
  });

  const voteMutation = useMutation<
    NominationUserVote,
    unknown,
    {
      nominationTypeId: string;
      entityKind: NominationEntityKind;
      entityId: string;
    }
  >({
    mutationFn: (vars) => NominationAPI.postVote(vars),
    onSuccess: (newVote) => {
      queryClient.setQueryData<NominationUserVote[] | undefined>(
        nominationsKeys.userVotes(authStore.user?.id ?? "unknown"),
        (prev) => (prev ? [...prev, newVote] : [newVote]),
      );
    },
  });

  /**
   * Submits a vote for a nomination.
   * This function calls the vote mutation and handles any errors by displaying notifications.
   *
   * @param nominationTypeId - The ID of the nomination type.
   * @param entityKind - The kind of entity being voted for (e.g., author or release).
   * @param entityId - The ID of the entity being voted for.
   */
  const postVote = async (
    nominationTypeId: string,
    entityKind: NominationEntityKind,
    entityId: string,
  ) => {
    try {
      await voteMutation.mutateAsync({
        nominationTypeId,
        entityKind,
        entityId,
      });
    } catch (error: unknown) {
      handleApiError(error, "Не удалось отправить голос!");
    }
  };

  return {
    candidates,
    userVotes,
    nominationTypes,
    postVote,
    isLoading: isCandidatesLoading || isVotesLoading || isTypesLoading,
  };
};
