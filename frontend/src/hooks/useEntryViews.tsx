import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import {
  viewsCreateViewMutation,
  viewsDeleteViewMutation,
  viewsGetViewQueryKey,
  viewsListViewsForEntryOptions,
  viewsListViewsForEntryQueryKey,
  viewsUpdateViewMutation,
} from "@/lib/client/@tanstack/react-query.gen";
import { useMolstar } from "@/contexts/MolstarProvider";
import { ViewResponse } from "@/lib/client";

export function useEntryViews(entryId: string) {
  const { viewer } = useMolstar();

  const queryClient = useQueryClient();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewToEdit, setViewToEdit] = useState(null);
  const [viewToDelete, setViewToDelete] = useState(null);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);

  const viewsQuery = useQuery({
    ...viewsListViewsForEntryOptions({
      path: {
        entry_id: entryId!,
      },
    }),
    enabled: !!entryId,
  });

  const createViewMutation = useMutation({
    ...viewsCreateViewMutation(),
    onSuccess: (newView) => {
      toast.success(`View "${newView.name}" created successfully`);
      queryClient.invalidateQueries({
        queryKey: viewsListViewsForEntryQueryKey({
          path: { entry_id: entryId },
        }),
      });
    },
  });

  const updateViewMutation = useMutation({
    ...viewsUpdateViewMutation(),
    onSuccess: (updatedView) => {
      toast.success(`View "${updatedView.name}" updated successfully`);
      queryClient.invalidateQueries({
        queryKey: viewsGetViewQueryKey({ path: { view_id: updatedView.id } }),
      });
    },
  });

  const deleteViewMutation = useMutation({
    ...viewsDeleteViewMutation(),
    onSuccess: (deletedViewId) => {
      toast.success("View deleted successfully");
      queryClient.invalidateQueries({
        queryKey: viewsGetViewQueryKey({ path: { view_id: deletedViewId } }),
      });
      queryClient.invalidateQueries({
        queryKey: viewsListViewsForEntryQueryKey({
          path: { entry_id: entryId },
        }),
      });
    },
  });

  const handleSaveView = async (name: string, description: string) => {
    if (!viewer) return;

    const snapshot: PluginState.Snapshot = viewer.getState();
    const thumbnail_image = await viewer.thumbnailImage();
    const snapshotJson = JSON.stringify(snapshot);
    const snapshotBlob = new Blob([snapshotJson], { type: "application/json" });

    createViewMutation.mutate({
      path: { entry_id: entryId },
      body: {
        name,
        description,
        snapshot_json: snapshotBlob,
        thumbnail_image,
      },
    });
    setShowSaveDialog(false);
  };

  const handleEditView = (view: ViewResponse) => {
    updateViewMutation.mutate({
      path: { entry_id: entryId, view_id: view.id },
      body: { name: view.name, description: view.description },
    });
    setViewToEdit(null);
  };

  const handleDeleteView = (viewId: string) => {
    deleteViewMutation.mutate({ path: { view_id: viewId } });
  };

  const handleLoadView = async (view: ViewResponse) => {
    await viewer.loadSnapshot(view.snapshot_url);
  };

  return {
    views: viewsQuery.data || [],
    currentViewId,
    screenshotUrls: {}, // Add actual implementation
    isViewsLoading: viewsQuery.isLoading,
    viewsError: viewsQuery.error,
    handleSaveView,
    handleEditView,
    handleDeleteView,
    handleLoadView,
    showSaveDialog,
    setShowSaveDialog,
    viewToEdit,
    setViewToEdit,
    viewToDelete,
    setViewToDelete,
  };
}
