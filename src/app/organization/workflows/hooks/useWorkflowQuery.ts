import { actionRequest } from "@/lib/utils/actionRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Params<T> = {
  url: string;
  queryKey: ID[];
  mutationKeys?: Array<ID[]>;
  initialData?: T;
  staleTime?: number;
  enabled?: boolean;
  mutationMethod?: "post" | "put" | "delete";
};

export function useWorkflowQuery<T>(params: Params<T>) {
  const stepsQuery = useQuery({
    enabled: params.enabled,
    queryKey: params.queryKey,
    initialData: params.initialData,
    staleTime: params.staleTime || 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await actionRequest<T>({
        method: "get",
        url: params.url,
      });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
  return stepsQuery;
}

export function useWorkflowMutation<T>(params: Params<T>) {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationKey: params.queryKey,
    mutationFn: async (data: T) => {
      const method =
        (data as any).mutationMethod || params.mutationMethod || "post";

      const response = await actionRequest<T>({
        data,
        method,
        url: params.url,
      });

      if (!response.success) throw new Error(response.message);
      return response.data;
    },

    onSuccess: async (data, vars) => {
      await queryClient.invalidateQueries({
        queryKey: params.queryKey,
        exact: false,
      });
      if (params.mutationKeys) {
        const promises = params.mutationKeys.map((keys) =>
          queryClient.invalidateQueries({ queryKey: keys, exact: false })
        );
        await Promise.all(promises);
      }
    },
  });
  return mutate;
}
