// src/components/views/SaveViewDialog.tsx
import { useState } from "react";
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

interface SaveViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description: string) => void;
}

export function SaveViewDialog({ open, onOpenChange, onSave }: SaveViewDialogProps) {
  const [viewName, setViewName] = useState("");
  const [viewDescription, setViewDescription] = useState("");

  const handleSave = () => {
    onSave(viewName, viewDescription);
    // Reset form
    setViewName("");
    setViewDescription("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setViewName("");
    setViewDescription("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Current View</AlertDialogTitle>
          <AlertDialogDescription>
            Provide a name and description for this view
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="View name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
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
          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}