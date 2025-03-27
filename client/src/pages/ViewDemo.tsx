import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { useMolstar } from "@/context/MolstarContext";
import { useState } from "react";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import snapshotExample1 from "../data/snapshot-example-1.json" assert { type: "json" };
import snapshotExample2 from "../data/snapshot-example-2.json" assert { type: "json" };
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Camera, Edit, MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type View = {
  id: string;
  name: string;
  description: string;
  snapshot: object;
};

export function ViewDemo() {
  const { viewer } = useMolstar();
  const [views, setViews] = useState<View[]>([
    {
      id: "example-snapshot-1",
      name: "Zoom out",
      description: "Default cartoon representation for structure 1TQN",
      snapshot: snapshotExample1,
    },
    {
      id: "example-snapshot-2",
      name: "Zoom in",
      description: "1TQN structure focused on A VAL 214",
      snapshot: snapshotExample2,
    },
  ]);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [newViewDescription, setNewViewDescription] = useState("");
  const [editingView, setEditingView] = useState<View | null>(null);

  // Save the current state as a new snapshot
  const handleSaveSnapshot = () => {
    setNewViewName("");
    setNewViewDescription("");
    setShowSaveDialog(true);
  };

  // Confirm saving the snapshot
  const confirmSaveSnapshot = () => {
    const view: View = {
      id: `view-${Date.now()}`,
      name: newViewName || `Snapshot ${views.length + 1}`,
      description: newViewDescription || "No description provided",
      snapshot: viewer.getState(),
    };
    console.log(viewer.getState());
    setViews((prev) => [...prev, view]);
    setShowSaveDialog(false);
  };

  // Open edit dialog for a view
  const handleEditView = (view: View) => {
    setEditingView(view);
    setNewViewName(view.name);
    setNewViewDescription(view.description);
    setShowEditDialog(true);
  };

  // Confirm editing a view
  const confirmEditView = () => {
    if (!editingView) return;

    setViews((prev) =>
      prev.map((view) =>
        view.id === editingView.id
          ? {
              ...view,
              name: newViewName || view.name,
              description: newViewDescription || view.description,
            }
          : view,
      ),
    );

    setShowEditDialog(false);
    setEditingView(null);
  };

  // Load a snapshot
  const loadSnapshot = (view: View) => {
    viewer.setState(view.snapshot as PluginState.Snapshot);
    setCurrentViewId(view.id);
  };

  // Delete a snapshot
  const handleDeleteSnapshot = (id: string) => {
    setViews((prev) => prev.filter((view) => view.id !== id));
    if (currentViewId === id) {
      setCurrentViewId(null);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background p-4">
      {/* Left Sidebar with Snapshots List */}
      <div className="flex w-80 flex-col mr-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Saved Views</h2>
          <Button onClick={handleSaveSnapshot} size="sm" className="gap-1">
            <Camera size={16} />
            <span>Save View</span>
          </Button>
        </div>

        <Separator className="mb-4" />

        <ScrollArea className="flex-grow pr-3">
          <div className="space-y-3">
            {views.map((view) => (
              <Card
                key={view.id}
                className={`transition-all hover:shadow-md m-2 ${currentViewId === view.id ? "ring-2 ring-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{view.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditView(view)}>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSnapshot(view.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {view.description}
                  </p>
                </CardContent>
                <CardFooter className="justify-center pt-2">
                  <Button
                    onClick={() => loadSnapshot(view)}
                    variant={currentViewId === view.id ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    <span>Load</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {views.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No snapshots saved yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side Viewer Container */}
      <div className="flex-1 rounded-md border overflow-hidden bg-card">
        <div className="h-full">
          <MolstarViewer />
        </div>
      </div>

      {/* Save Snapshot Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Current View</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a name and description for this snapshot
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Snapshot name"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description of this view"
                value={newViewDescription}
                onChange={(e) => setNewViewDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveSnapshot}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit View Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit View</AlertDialogTitle>
            <AlertDialogDescription>
              Update the name and description for this view
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="View name"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Description of this view"
                value={newViewDescription}
                onChange={(e) => setNewViewDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditingView(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmEditView}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
