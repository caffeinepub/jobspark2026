import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResult, UserProfile, WorkEntry } from "../backend";
import { useActor } from "./useActor";

const PAGE_SIZE = BigInt(6);

export function useGetEntriesCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["entriesCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getEntriesCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPaginatedEntries(page: number) {
  const { actor, isFetching } = useActor();
  return useQuery<PaginatedResult>({
    queryKey: ["paginatedEntries", page],
    queryFn: async () => {
      if (!actor)
        return {
          totalEntries: BigInt(0),
          page: BigInt(1),
          entries: [],
          totalPages: BigInt(1),
        };
      return actor.getPaginatedEntries(BigInt(page), PAGE_SIZE);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTodayEarnings() {
  const { actor, isFetching } = useActor();
  const today = new Date().toISOString().split("T")[0];
  return useQuery<bigint>({
    queryKey: ["todayEarnings", today],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTodayEarnings(today);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalEarnings() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalEarnings"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalEarnings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalWithdrawn() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalWithdrawn"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalWithdrawn();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchEntries(projectName: string) {
  const { actor, isFetching } = useActor();
  return useQuery<WorkEntry[]>({
    queryKey: ["searchEntries", projectName],
    queryFn: async () => {
      if (!actor) return [];
      if (!projectName.trim()) return [];
      return actor.searchEntriesByProjectName(projectName);
    },
    enabled: !!actor && !isFetching && projectName.trim().length > 0,
  });
}

export function useSeedEntries() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.seedEntriesOnce();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginatedEntries"] });
      queryClient.invalidateQueries({ queryKey: ["entriesCount"] });
      queryClient.invalidateQueries({ queryKey: ["totalEarnings"] });
      queryClient.invalidateQueries({ queryKey: ["totalWithdrawn"] });
      queryClient.invalidateQueries({ queryKey: ["todayEarnings"] });
    },
  });
}
