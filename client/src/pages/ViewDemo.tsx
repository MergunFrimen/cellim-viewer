// src/pages/ViewDemo.tsx
import { Button } from "@/components/ui/button";
import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { ViewsSidebar } from "@/components/views/ViewsSidebar";
import { SaveViewDialog } from "@/components/views/SaveViewDialog";
import { EditViewDialog } from "@/components/views/EditViewDialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { useMolstar } from "@/context/MolstarContext";
import { useViews } from "@/hooks/useViews";
import { View } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { Expand, Loader, SidebarOpen, SidebarClose } from "lucide-react";
import { useBehavior } from "@/hooks/useBehavior";
import snapshotExample1 from "../data/snapshot-example-1.json";
import snapshotExample2 from "../data/snapshot-example-2.json";
import { toast } from "sonner";

export function ViewDemo() {
  const { viewer } = useMolstar();

  // Initialize with example views
  const initialViews = [
    {
      id: "example-snapshot-1",
      title: "Zoom out",
      description: "Default cartoon representation for structure 1TQN",
      mvsj: snapshotExample1,
      created_at: null,
      updated_at: null,
    },
    {
      id: "example-snapshot-2",
      title: "Zoom in",
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
  const [showSidebar, setShowSidebar] = useState(true);

  // Get viewer states
  const isLoading = useBehavior(viewer.state.isLoading);
  const isExpanded = useBehavior(viewer.state.isExpanded);
  const showControls = useBehavior(viewer.state.showControls);

  // Toggle viewer controls
  const toggleControls = useCallback(() => {
    viewer.state.showControls.next(!showControls);
  }, [viewer, showControls]);

  // Toggle fullscreen
  const toggleExpand = useCallback(() => {
    viewer.state.isExpanded.next(!isExpanded);
  }, [viewer, isExpanded]);

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
    await updateView(viewId, { title: name, description });
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
        {showSidebar && (
          <aside className="p-4 border-r h-full overflow-hidden flex flex-col">
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
        )}

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
        description={`Are you sure you want to delete "${viewToDelete?.title}"? This action cannot be undone.`}
        open={!!viewToDelete}
        onOpenChange={(open) => !open && setViewToDelete(null)}
        onConfirm={confirmDeleteView}
      />
    </div>
  );
}
