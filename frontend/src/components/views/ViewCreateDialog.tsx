// src/components/views/SaveViewDialog.tsx
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
import { useMolstar } from "@/contexts/MolstarProvider";
import { Camera } from "lucide-react";
import { useState } from "react";

interface SaveViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description: string) => void;
  screenshotPreview?: string;
}

export function SaveViewDialog({
  open,
  onOpenChange,
  onSave,
  screenshotPreview,
}: SaveViewDialogProps) {
  const { viewer } = useMolstar();
  const [viewName, setViewName] = useState("");
  const [viewDescription, setViewDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    screenshotPreview,
  );

  // Take a screenshot when the dialog opens
  const captureScreenshot = async () => {
    if (!previewUrl) {
      try {
        const url = await viewer.screenshot();
        setPreviewUrl(url);
      } catch (error) {
        console.error("Failed to capture screenshot:", error);
      }
    }
  };

  const handleSave = () => {
    onSave(viewName, viewDescription);
    // Reset form
    setViewName("");
    setViewDescription("");
    setPreviewUrl(undefined);
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setViewName("");
    setViewDescription("");
    setPreviewUrl(undefined);
  };

  // Capture screenshot when dialog opens
  if (open && !previewUrl) {
    captureScreenshot();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Current View</AlertDialogTitle>
          <AlertDialogDescription>
            Provide a name and description for this view
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Screenshot Preview */}
        <div className="my-2">
          <Label htmlFor="preview">Preview</Label>
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
                <p className="text-xs">Generating preview...</p>
              </div>
            )}
          </div>
        </div>

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
