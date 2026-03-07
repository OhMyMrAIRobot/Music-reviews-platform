import { useQuery } from "@tanstack/react-query";
import { RolesAPI } from "../../api/role-api";
import { usersKeys } from "../../query-keys/users-keys";

/**
 * Custom hook to fetch and manage user roles metadata.
 * This hook uses React Query to retrieve the list of available user roles,
 * caching the data indefinitely to avoid unnecessary refetches.
 *
 * @returns An object containing user roles metadata:
 * - `roles`: Array of user roles (defaults to empty array if not loaded).
 * - `isLoading`: Boolean indicating if the data is currently being fetched.
 */
export function useRoleMeta() {
  const { data: roles = [], isPending } = useQuery({
    queryKey: usersKeys.roles,
    queryFn: () => RolesAPI.fetchRoles(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return {
    roles,
    isLoading: isPending,
  };
}
