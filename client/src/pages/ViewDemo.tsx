import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { useMolstar } from "@/context/MolstarContext";
import { useState } from "react";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import snapshotExample from "./snapshot-example.json" assert { type: "json" };
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, FileUp, Camera } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type View = {
  id: string;
  name: string;
  description: string;
  snapshot: object;
  createdAt: Date;
};

export function ViewDemo() {
  const { viewer } = useMolstar();
  const [views, setViews] = useState<View[]>([
    {
      id: "example-snapshot",
      name: "Example Snapshot",
      description: "Default protein visualization with cartoon representation",
      snapshot: snapshotExample.entries[0].snapshot,
      createdAt: new Date(),
    },
  ]);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [newViewDescription, setNewViewDescription] = useState("");
  const [deleteViewId, setDeleteViewId] = useState<string | null>(null);

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
      createdAt: new Date(),
    };
    setViews((prev) => [...prev, view]);
    setShowSaveDialog(false);
  };

  // Load a snapshot
  const loadSnapshot = (view: View) => {
    viewer.setState(view.snapshot as PluginState.Snapshot);
    setCurrentViewId(view.id);
  };

  // Delete a snapshot
  const handleDeleteSnapshot = (id: string) => {
    setDeleteViewId(id);
  };

  // Confirm deleting the snapshot
  const confirmDeleteSnapshot = () => {
    if (deleteViewId) {
      setViews((prev) => prev.filter((view) => view.id !== deleteViewId));
      setDeleteViewId(null);
      if (currentViewId === deleteViewId) {
        setCurrentViewId(null);
      }
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{view.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {formatTime(view.createdAt)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {view.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-4 flex justify-between">
                  <Button
                    onClick={() => loadSnapshot(view)}
                    variant={currentViewId === view.id ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                  >
                    <span>{currentViewId === view.id ? "Loaded" : "Load"}</span>
                  </Button>
                  <Button
                    onClick={() => handleDeleteSnapshot(view.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 size={14} />
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

      {/* Delete Snapshot Confirmation Dialog */}
      <AlertDialog
        open={!!deleteViewId}
        onOpenChange={(open) => !open && setDeleteViewId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Snapshot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this snapshot? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={confirmDeleteSnapshot}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
