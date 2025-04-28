import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { useMolstar } from "@/contexts/MolstarProvider";
import { HttpValidationError } from "@/lib/client";
import {
  entriesDeleteEntryMutation,
  entriesGetEntryOptions,
  entriesGetEntryQueryKey,
  entriesUpdateEntryMutation,
  viewsCreateViewMutation,
  viewsDeleteViewMutation,
  viewsGetViewQueryKey,
  viewsListViewsForEntryOptions,
  viewsListViewsForEntryQueryKey,
} from "@/lib/client/@tanstack/react-query.gen";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { ViewsSidebar } from "@/components/views/ViewSidebar";
import { useViews } from "@/hooks/useViews";

export function EntryDetailsPage() {
  const { viewer } = useMolstar();

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<View | null>(null);
  const [viewToDelete, setViewToDelete] = useState<View | null>(null);

  const entryId = params.id!;

  useEffect(() => {
    viewer.clear();
  }, [viewer]);

  const entryQuery = useQuery({
    ...entriesGetEntryOptions({
      path: {
        entry_id: entryId,
      },
    }),
  });

  const viewsQuery = useQuery({
    ...viewsListViewsForEntryOptions({
      path: {
        entry_id: entryId,
      },
    }),
  });

  const deleteEntryMutation = useMutation({
    ...entriesDeleteEntryMutation(),
    onSuccess: (deletedEntryId) => {
      queryClient.invalidateQueries({
        queryKey: entriesGetEntryQueryKey({
          path: { entry_id: deletedEntryId },
        }),
      });
      navigate("/");
    },
    onError: (error: HttpValidationError) => {
      toast.error(
        "Failed to delete entry: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
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
    onError: (error) => {
      toast.error(
        "Failed to save view: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  const updateViewMutation = useMutation({
    ...entriesUpdateEntryMutation(),
    onSuccess: (updatedView) => {
      toast.success(`View "${updatedView.name}" updated successfully`);
      queryClient.invalidateQueries({
        queryKey: viewsGetViewQueryKey({ path: { view_id: updatedView.id } }),
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to update view: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  const deleteViewMutation = useMutation({
    ...viewsDeleteViewMutation(),
    onSuccess: (deletedViewId) => {
      toast.success("View deleted successfully");
      queryClient.invalidateQueries({
        queryKey: viewsGetViewQueryKey({ path: { view_id: deletedViewId } }),
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to delete view: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  const {
    views,
    currentViewId,
    screenshotUrls,
    reorderViews,
    setCurrentView,
    getViewById,
  } = useViews({
    initialViews: viewsQuery.data || [],
    onViewsChange: () => {
      queryClient.invalidateQueries({ queryKey: ["views", entryId] });
    },
  });

  const handleLoadView = async (view: View) => {
    if (view.mvsj) {
      setCurrentView(view.id);
      await viewer.setState(view.mvsj);
    }
  };

  const handleSaveView = () => {
    setShowSaveDialog(true);
  };

  // Handle editing a view
  const handleEditView = (view: View) => {
    setViewToEdit(view);
  };

  // Handle deleting a view
  const handleDeleteView = (viewId: string) => {
    const view = getViewById(viewId);
    if (view) {
      setViewToDelete(view);
    }
  };

  if (entryQuery.isLoading || viewsQuery.isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-8">Loading entry data...</div>
      </div>
    );
  }

  if (entryQuery.isError || viewsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Entry not found or cannot be loaded.
        </AlertDescription>
      </Alert>
    );
  }

  if (!entryQuery.isSuccess || !entryQuery.isSuccess) return;

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{entryQuery.data.name}</h1>

            {entryQuery.data.is_public ? (
              <Badge variant="outline">Public</Badge>
            ) : (
              <Badge variant="outline">Private</Badge>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            Created on {formatDate(entryQuery.data.created_at)}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {entryQuery.data?.description ? (
                  <ReactMarkdown>{entryQuery.data?.description}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-x-3">
        <aside className="overflow-hidden flex flex-col h-[80vh]">
          <ViewsSidebar
            views={views}
            currentViewId={currentViewId}
            screenshotUrls={screenshotUrls}
            onSaveView={handleSaveView}
            onEditView={handleEditView}
            onLoadView={handleLoadView}
            onDeleteView={handleDeleteView}
            onReorderViews={reorderViews}
          />
        </aside>

        {/* Viewer area */}
        <main className="flex-1 relative">
          <MolstarViewer />
        </main>
      </div>

      {/* <SaveViewDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={onSaveView}
      />
      <EditViewDialog
        open={!!viewToEdit}
        onOpenChange={(open) => !open && setViewToEdit(null)}
        view={viewToEdit}
        onUpdate={onUpdateView}
      />
      <DeleteDialog
        title="Delete View"
        description={`Are you sure you want to delete "${viewToDelete?.name}"? This action cannot be undone.`}
        open={!!viewToDelete}
        onOpenChange={(open) => !open && setViewToDelete(null)}
        onConfirm={confirmDeleteView}
      />
      <DeleteDialog
        title="Delete Entry"
        description={`Are you sure you want to delete "${entry.name}"? This action cannot be undone.`}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={deleteEntryMutation.isPending}
      /> */}
    </div>
  );
}
