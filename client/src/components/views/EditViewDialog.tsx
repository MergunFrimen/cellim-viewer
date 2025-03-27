// src/components/views/EditViewDialog.tsx
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
import { View } from "@/types";

interface EditViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view: View | null;
  onUpdate: (viewId: string, name: string, description: string) => void;
}

export function EditViewDialog({
  open,
  onOpenChange,
  view,
  onUpdate,
}: EditViewDialogProps) {
  const [viewName, setViewName] = useState("");
  const [viewDescription, setViewDescription] = useState("");

  // Update form when view changes
  useEffect(() => {
    if (view) {
      setViewName(view.title);
      setViewDescription(view.description);
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
