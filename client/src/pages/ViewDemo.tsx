import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { useMolstar } from "@/context/MolstarContext";
import { useState } from "react";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import snapshotExample1 from "./snapshot-example-1.json" assert { type: "json" };
import snapshotExample2 from "./snapshot-example-2.json" assert { type: "json" };
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Camera } from "lucide-react";
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
  const [newViewName, setNewViewName] = useState("");
  const [newViewDescription, setNewViewDescription] = useState("");

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
                <CardHeader className="">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{view.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {view.description}
                  </p>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    onClick={() => loadSnapshot(view)}
                    variant={currentViewId === view.id ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                  >
                    <span>Load</span>
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
    </div>
  );
}
