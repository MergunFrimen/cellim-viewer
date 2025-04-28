// src/components/views/ViewEditDialog.tsx
import { useEffect, useState } from "react";
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
import { ViewResponse } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useMolstar } from "@/contexts/MolstarProvider";

interface EditViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view: ViewResponse | null;
  onUpdate: (viewId: string, name: string, description: string) => void;
  onRecreateSnapshot?: (viewId: string) => Promise<void>;
}

export function EditViewDialog({
  open,
  onOpenChange,
  view,
  onUpdate,
  onRecreateSnapshot,
}: EditViewDialogProps) {
  const { viewer } = useMolstar();
  const [viewName, setViewName] = useState("");
  const [viewDescription, setViewDescription] = useState("");
  const [isRecreating, setIsRecreating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Update form when view changes
  useEffect(() => {
    if (view) {
      setViewName(view.name);
      setViewDescription(view.description || "");
      setPreviewUrl(view.thumbnail_url);
    }
  }, [view]);

  const handleUpdate = () => {
    if (view) {
      onUpdate(view.id, viewName, viewDescription);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const captureNewPreview = async () => {
    if (!viewer) return;

    try {
      const url = await viewer.screenshot();
      setPreviewUrl(url);
    } catch (error) {
      console.error("Failed to capture new preview:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit View</AlertDialogTitle>
          <AlertDialogDescription>
            Update the name and description for this view
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <Label>Preview</Label>
          <div className="aspect-video mt-2 bg-secondary rounded-md overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="View preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Camera size={32} className="mb-2" />
                <p className="text-xs">No preview available</p>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={captureNewPreview}
              disabled={isRecreating}
            >
              <Camera className="h-4 w-4 mr-2" />
              Update Preview
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              placeholder="View name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Description of this view"
              value={viewDescription}
              onChange={(e) => setViewDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
