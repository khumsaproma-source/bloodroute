import {
  type BloodRequestInput,
  type HospitalInput,
  type Profile,
  type RequestStatus,
  type RouteRequest,
  type RouteResult,
  createActor,
} from "@/backend";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const hospitalKeys = {
  all: ["hospitals"] as const,
  detail: (id: string) => ["hospital", id] as const,
  search: (term: string) => ["hospitals", "search", term] as const,
};

export const requestKeys = {
  all: ["requests"] as const,
  detail: (id: bigint) => ["request", id.toString()] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
};

// --- Hospitals ---

export function useListHospitals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: hospitalKeys.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listHospitals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHospital(id: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: hospitalKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getHospital(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchHospitals(term: string) {
  const { actor, isFetching } = useActor(createActor);
  const trimmed = term.trim();
  return useQuery({
    queryKey: hospitalKeys.search(trimmed),
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchHospitals(trimmed);
    },
    enabled: !!actor && !isFetching && trimmed.length > 0,
  });
}

export function useUpsertHospital() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: HospitalInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.upsertHospital(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hospitalKeys.all });
    },
  });
}

export function useDeleteHospital() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteHospital(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hospitalKeys.all });
    },
  });
}

// --- Routes ---

export function useComputeRoute() {
  const { actor } = useActor(createActor);
  return useMutation<RouteResult, Error, RouteRequest>({
    mutationFn: async (request: RouteRequest) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.computeRoute(request);
    },
  });
}

// --- Blood requests ---

export function useListRequests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: requestKeys.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRequest(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: requestKeys.detail(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getRequest(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BloodRequestInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createRequest(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: RequestStatus;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateRequestStatus(id, status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useDeleteRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteRequest(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

// --- Profile ---

export function useProfile() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<Profile | null>({
    queryKey: ["profile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getProfile();
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSetProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      displayName,
      organizationName,
    }: {
      displayName: string;
      organizationName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setProfile(displayName, organizationName);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["profile", identity?.getPrincipal().toString()],
      });
    },
  });
}
