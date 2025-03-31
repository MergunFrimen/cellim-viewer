// src/pages/ViewDemo.tsx
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { SaveViewDialog } from "@/components/views/ViewCreateDialog";
import { EditViewDialog } from "@/components/views/ViewEditDialog";
import { ViewsSidebar } from "@/components/views/ViewSidebar";
import { useMolstar } from "@/context/MolstarContext";
import { useBehavior } from "@/hooks/useBehavior";
import { useViews } from "@/hooks/useViews";
import { View } from "@/types";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import snapshotExample1 from "../data/snapshot-example-1.json";
import snapshotExample2 from "../data/snapshot-example-2.json";

export function ViewDemo() {
  const { viewer } = useMolstar();

  // Initialize with example views
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

  // Use our custom hook
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

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<View | null>(null);
  const [viewToDelete, setViewToDelete] = useState<View | null>(null);

  // Get viewer states
  const isLoading = useBehavior(viewer.state.isLoading);

  useEffect(() => {
    viewer.clear();
  }, [viewer]);

  // Handle saving a new view
  const handleSaveView = () => {
    setShowSaveDialog(true);
  };

  // Save view from dialog
  const onSaveView = async (name: string, description: string) => {
    const snapshot = viewer.getState();
    await createView(name, description, snapshot);
    setShowSaveDialog(false);
  };

  // Handle loading a view
  const handleLoadView = async (view: View) => {
    if (view.mvsj) {
      setCurrentView(view.id);
      await viewer.setState(view.mvsj);
    }
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

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Main Content Area - Using flex and making sure both sidebar and content can scroll independently */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with proper height constraints */}
        <aside className="border-r h-full overflow-hidden flex flex-col">
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
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <Loader className="h-8 w-8 animate-spin" />
                <p className="mt-2">Loading view...</p>
              </div>
            </div>
          )}
          <MolstarViewer />
        </main>
      </div>

      {/* Dialogs */}
      <SaveViewDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={onSaveView}
      />

      {/* Edit View Dialog */}
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
    </div>
  );
}
