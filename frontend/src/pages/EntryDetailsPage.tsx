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
import snapshotExample1 from "../data/snapshot-example-1.json";
import snapshotExample2 from "../data/snapshot-example-2.json";

const initialViews = [
  {
    id: "example-snapshot-1",
    name: "Zoom out",
    description: "Default cartoon representation for structure 1TQN",
    mvsj: snapshotExample1,
    created_at: null,
    updated_at: null,
  },
  {
    id: "example-snapshot-2",
    name: "Zoom in",
    description: "1TQN structure focused on A VAL 214",
    mvsj: snapshotExample2,
    created_at: null,
    updated_at: null,
  },
];

export function EntryDetailPage() {
  const { viewer } = useMolstar();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<View | null>(null);
  const [viewToDelete, setViewToDelete] = useState<View | null>(null);

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
  } = useViews({ initialViews });

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

  // Delete mutation
  const deleteMutation = useMutation({
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

  const onSaveView = async (name: string, description: string) => {
    const snapshot = viewer.getState();
    await createView(name, description, snapshot);
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
    await updateView(viewId, { name: name, description });
    setViewToEdit(null);
    toast.success("View updated successfully");
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
      deleteView(viewToDelete.id);
      setViewToDelete(null);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
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
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
