import { actionRequest } from "@/lib/utils/actionRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Params = {
  url: string;
  queryKey: string[];
  staleTime?: number;
  mutationMethod?: "post" | "put" | "delete";
};

export function useWorkflowQuery<T>(params: Params) {
  const stepsQuery = useQuery({
    queryKey: params.queryKey,
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

export function useWorkflowMutation<T>(params: Params) {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationKey: params.queryKey,
    mutationFn: async (data: T) => {
      const response = await actionRequest<T>({
        data,
        url: params.url,
        method: params.mutationMethod || "post",
      });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: params.queryKey });
    },
  });
  return mutate;
}
