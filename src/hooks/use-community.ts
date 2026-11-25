import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createContext, createElement, useCallback, useContext, type ReactNode } from "react";
import { BackendUnavailable, communityMode } from "@/lib/community-data";
import { getMyEngagementState, toggleBookmark, toggleFollow, toggleReaction } from "@/lib/community.functions";
import { useMember } from "@/hooks/use-member";

// Whether migration 0007 is live, and how community publishing is configured.
export function useCommunity() {
  const query = useQuery({
    queryKey: ["community-mode"],
    queryFn: async () => {
      try { return { available: true as const, mode: await communityMode() }; }
      catch (error) { if (error instanceof BackendUnavailable) return { available: false as const, mode: "pre_moderated" as const }; throw error; }
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
  return { ready: !query.isLoading, available: query.data?.available ?? false, mode: query.data?.mode ?? "pre_moderated", error: query.isError };
}

type EngagementApi = ReturnType<typeof useEngagementState>;
const EngagementContext = createContext<EngagementApi | null>(null);

// One request for a whole feed: wrap a list in this provider and every action bar inside reads
// from it instead of asking the server separately.
export function EngagementProvider({ ids, children }: { ids: string[]; children: ReactNode }) {
  const api = useEngagementState(ids);
  return createElement(EngagementContext.Provider, { value: api }, children);
}

export function useEngagement(ids: string[]) {
  const shared = useContext(EngagementContext);
  const own = useEngagementState(shared ? [] : ids, !shared);
  return shared ?? own;
}

// The signed-in person's reactions, bookmarks and follows, plus toggles that refresh them.
function useEngagementState(ids: string[], enabled = true) {
  const { user } = useMember();
  const fetchState = useServerFn(getMyEngagementState);
  const react = useServerFn(toggleReaction);
  const mark = useServerFn(toggleBookmark);
  const follow = useServerFn(toggleFollow);
  const queryClient = useQueryClient();
  const key = ["engagement", user?.id, ids.slice().sort().join(",")];
  const state = useQuery({ queryKey: key, queryFn: () => fetchState({ data: { ids } }), enabled: !!user && enabled, staleTime: 30_000 });
  const refresh = useCallback(() => Promise.all([queryClient.invalidateQueries({ queryKey: ["engagement"] }), queryClient.invalidateQueries({ queryKey: ["village"] })]), [queryClient]);
  const data = state.data;
  return {
    signedIn: !!user,
    reacted: (id: string, kind: "appreciate" | "useful") => !!data?.reactions.some((r) => r.content_id === id && r.kind === kind),
    saved: (id: string) => !!(data?.bookmarks as string[] | undefined)?.includes(id),
    following: (type: string, target: string) => !!data?.follows.some((f) => f.target_type === type && f.target_key === target),
    follows: data?.follows ?? [],
    toggleReaction: async (contentId: string, kind: "appreciate" | "useful", on: boolean) => { await react({ data: { contentId, kind, on } }); await refresh(); },
    toggleBookmark: async (contentId: string, on: boolean) => { await mark({ data: { contentId, on } }); await refresh(); },
    toggleFollow: async (targetType: "profile" | "country" | "topic" | "question" | "chapter", targetKey: string, on: boolean) => { await follow({ data: { targetType, targetKey, on } }); await refresh(); },
  };
}
