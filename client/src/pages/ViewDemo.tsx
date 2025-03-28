// src/pages/ViewDemo.tsx
import { useState } from "react";
import { useMolstar } from "@/context/MolstarContext";
import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { ViewsSidebar } from "@/components/views/ViewsSidebar";
import { SaveViewDialog } from "@/components/views/SaveViewDialog";
import { EditViewDialog } from "@/components/views/EditViewDialog";
import { useViews } from "@/hooks/useViews";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import { toast } from "sonner";

// Import sample data
import snapshotExample1 from "../data/snapshot-example-1.json" assert { type: "json" };
import snapshotExample2 from "../data/snapshot-example-2.json" assert { type: "json" };

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
    createView,
    updateView,
    deleteView,
    reorderViews,
    setCurrentView,
    getViewById,
  } = useViews({ initialViews });

  // Dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingViewId, setEditingViewId] = useState<string | null>(null);

  // Handlers
  const handleSaveView = (name: string, description: string) => {
    const newView = createView(name, description, viewer.getState());
    setShowSaveDialog(false);
    toast.success("View saved successfully");
    setCurrentView(newView.id);
  };

  const handleEditView = (viewId: string) => {
    setEditingViewId(viewId);
    setShowEditDialog(true);
  };

  const handleUpdateView = (
    viewId: string,
    name: string,
    description: string,
  ) => {
    updateView(viewId, { title: name, description });
    setShowEditDialog(false);
    setEditingViewId(null);
    toast.success("View updated successfully");
  };

  const handleLoadView = (viewId: string) => {
    const view = getViewById(viewId);
    if (view) {
      viewer.setState(view.mvsj as PluginState.Snapshot);
      setCurrentView(viewId);
      toast.success(`Loaded view: ${view.title}`);
    }
  };

  const handleReorderViews = (
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    reorderViews(sourceIndex, destinationIndex);
    toast.success("Views reordered");
  };

  // Get the current editing view
  const editingView = editingViewId ? getViewById(editingViewId) : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background p-4">
      {/* Left Sidebar with Views List */}
      <ViewsSidebar
        views={views}
        currentViewId={currentViewId}
        onSaveView={() => setShowSaveDialog(true)}
        onEditView={(view) => handleEditView(view.id)}
        onLoadView={(view) => handleLoadView(view.id)}
        onDeleteView={deleteView}
        onReorderViews={handleReorderViews}
      />

      {/* Right Side Viewer Container */}
      <div className="flex-1 rounded-md border overflow-hidden bg-card">
        <div className="h-full">
          <MolstarViewer />
        </div>
      </div>

      {/* Save View Dialog */}
      <SaveViewDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveView}
      />

      {/* Edit View Dialog */}
      <EditViewDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        view={editingView}
        onUpdate={handleUpdateView}
      />
    </div>
  );
}
