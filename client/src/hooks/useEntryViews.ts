import { ViewResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useEntryViews = (entryId: string) => {
  return useQuery<ViewResponse[]>({
    queryKey: ["entryViews", entryId],
    queryFn: async () => {
      const response = await fetch(`http://0.0.0.0:8000/api/views/entry/${entryId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};