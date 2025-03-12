import { EntriesResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useEntries = (page: number = 1, perPage: number = 10) => {
  return useQuery<EntriesResponse>({
    queryKey: ["entries", page, perPage],
    queryFn: async () => {
      const response = await fetch(
        `http://0.0.0.0:8000/api/entries?page=${page}&per_page=${perPage}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};
