import { entriesApi } from "@/api/clients/entry-client";
import { viewsApi } from "@/api/clients/views-client";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewsSidebar } from "@/components/views/ViewSidebar";
import { useMolstar } from "@/context/MolstarContext";
import { useViews } from "@/hooks/useViews";
import { View } from "@/types";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { SaveViewDialog } from "@/components/views/ViewCreateDialog";
import { EditViewDialog } from "@/components/views/ViewEditDialog";
import { toast } from "sonner";

export function EntryDetailPage() {
  const { viewer } = useMolstar();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<View | null>(null);
  const [viewToDelete, setViewToDelete] = useState<View | null>(null);

  const entryId = params.id;

  useEffect(() => {
    viewer.clear();
  }, [viewer]);

  // Determine the appropriate query function based on the route
  const fetchEntry = async () => {
    if (entryId) {
      return entriesApi.getById(entryId);
    }
    throw new Error("Invalid route parameters");
  };

  const fetchViews = async () => {
    if (entryId) {
      return viewsApi.listByEntry(entryId);
    }
    throw new Error("Invalid route parameters");
  };

  // Query for entry and its views
  const [entryQuery, viewsQuery] = useQueries({
    queries: [
      {
        queryKey: ["entry", entryId],
        queryFn: fetchEntry,
        enabled: !!entryId,
      },
      {
        queryKey: ["views", entryId],
        queryFn: fetchViews,
        enabled: !!entryId,
      },
    ],
  });

  const {
    views,
    currentViewId,
    screenshotUrls,
    createView,
    updateView,
    deleteView,
    reorderViews,
    setCurrentView,
    getViewById,
  } = useViews({
    initialViews: viewsQuery.data || [],
    onViewsChange: () => {
      // This will be called whenever the local views state changes
      queryClient.invalidateQueries({ queryKey: ["views", entryId] });
    },
  });

  // Update local views when backend data changes
  useEffect(() => {
    if (viewsQuery.data) {
      // Generate screenshot URLs for views that don't have them yet
      viewsQuery.data.forEach(async (view) => {
        if (view.mvsj && !screenshotUrls[view.id]) {
          try {
            await viewer.setState(view.mvsj);
            const url = await viewer.screenshot();
            updateView(view.id, { screenshot: url });
          } catch (error) {
            console.error(
              `Failed to generate screenshot for view ${view.id}:`,
              error,
            );
          }
        }
      });
    }
  }, [viewsQuery.data]);

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: () => {
      if (!entryQuery.data) throw new Error("Entry not found");
      return entriesApi.delete(entryQuery.data.id);
    },
    onSuccess: () => {
      // Invalidate the entries list query
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      // Navigate back to entries list
      navigate("/entries");
    },
  });

  // Create view mutation
  const createViewMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      mvsj: any;
    }) => {
      if (!entryId) throw new Error("No entry ID provided");

      return viewsApi.create({
        name: data.name,
        description: data.description,
        mvsj: data.mvsj,
        entry_id: entryId,
      });
    },
    onSuccess: (newView) => {
      // Create view locally and add screenshot
      createView(newView.id, newView.name, newView.description, newView.mvsj);

      // Add toast notification
      toast.success(`View "${newView.name}" created successfully`);

      // Refresh views list from backend
      queryClient.invalidateQueries({ queryKey: ["views", entryId] });
    },
    onError: (error) => {
      toast.error(
        "Failed to save view: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  // Update view mutation
  const updateViewMutation = useMutation({
    mutationFn: async (data: {
      viewId: string;
      name: string;
      description: string;
    }) => {
      return viewsApi.update(data.viewId, {
        name: data.name,
        description: data.description,
      });
    },
    onSuccess: (updatedView) => {
      // Update local view state
      updateView(updatedView.id, {
        name: updatedView.name,
        description: updatedView.description,
      });

      // Show success notification
      toast.success(`View "${updatedView.name}" updated successfully`);

      // Refresh views from backend
      queryClient.invalidateQueries({ queryKey: ["views", entryId] });
    },
    onError: (error) => {
      toast.error(
        "Failed to update view: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  // Delete view mutation
  const deleteViewMutation = useMutation({
    mutationFn: (viewId: string) => {
      return viewsApi.delete(viewId);
    },
    onSuccess: (_, viewId) => {
      // Delete from local state
      deleteView(viewId);

      // Show success notification
      toast.success("View deleted successfully");

      // Refresh views from backend
      queryClient.invalidateQueries({ queryKey: ["views", entryId] });
    },
    onError: (error) => {
      toast.error(
        "Failed to delete view: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  const onSaveView = async (name: string, description: string) => {
    // Get the molstar state snapshot
    const snapshot = viewer.getState();

    // Call the mutation to create the view
    createViewMutation.mutate({
      name,
      description,
      mvsj: snapshot,
    });

    // Close the dialog
    setShowSaveDialog(false);
  };

  const entry = entryQuery.data;
  const isLoading = entryQuery.isLoading || viewsQuery.isLoading;
  const error = entryQuery.error || viewsQuery.error;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-8">Loading entry data...</div>
      </div>
    );
  }

  if (error || !entry) {
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

  // Update view from edit dialog
  const onUpdateView = async (
    viewId: string,
    name: string,
    description: string,
  ) => {
    updateViewMutation.mutate({
      viewId,
      name,
      description,
    });
    setViewToEdit(null);
  };

  // Handle deleting a view
  const handleDeleteView = (viewId: string) => {
    const view = getViewById(viewId);
    if (view) {
      setViewToDelete(view);
    }
  };

  // Confirm view deletion
  const confirmDeleteView = () => {
    if (viewToDelete) {
      deleteViewMutation.mutate(viewToDelete.id);
      setViewToDelete(null);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteEntryMutation.mutate();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return format(new Date(dateString), "PPP");
  };

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{entry.name}</h1>

            {entry.is_public ? (
              <Badge variant="outline">Public</Badge>
            ) : (
              <Badge variant="outline">Private</Badge>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            Created on {formatDate(entry.created_at)}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {entry.description ? (
                  <ReactMarkdown>{entry.description}</ReactMarkdown>
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
        {/* Sidebar with proper height constraints */}
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

      <SaveViewDialog
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
      />
    </div>
  );
}
