import { viewsListViewsForEntryOptions } from "@/lib/client/@tanstack/react-query.gen";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useEntryViews(entryId: string) {
  const queryClient = useQueryClient();

  const [viewToEdit, setViewToEdit] = useState(null);
  const [viewToDelete, setViewToDelete] = useState(null);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);

  const listViewsQuery = useQuery({
    ...viewsListViewsForEntryOptions({
      path: {
        entry_id: entryId!,
      },
    }),
    enabled: !!entryId,
  });

  return {
    views: listViewsQuery.data || [],
    currentViewId,
    isViewsLoading: listViewsQuery.isLoading,
    viewsError: listViewsQuery.error,
    viewToEdit,
    setViewToEdit,
    viewToDelete,
    setViewToDelete,
  };
}
