import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryName: string;
  editLink: string;
  shareLink?: string;
  isPublic: boolean;
}

export function ShareLinkDialog({
  open,
  onOpenChange,
  entryName,
  editLink,
  shareLink,
  isPublic,
}: ShareLinkDialogProps) {
  const [editLinkCopied, setEditLinkCopied] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const copyToClipboard = async (text: string, setIsCopied: (copied: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getFullUrl = (path: string) => {
    const baseUrl = window.location.origin;
    // If we're using a subdirectory for deployment, include it
    const basePath = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    return `${baseUrl}${basePath}${path}`;
  };

  const fullEditLink = getFullUrl(`/edit/${editLink}`);
  const fullShareLink = shareLink ? getFullUrl(`/share/${shareLink}`) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entry Created Successfully</DialogTitle>
          <DialogDescription>
            "{entryName}" has been created. Save these links to access and share your entry in the future.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-link" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Edit Link (Private)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="edit-link"
                value={fullEditLink}
                readOnly
                className="flex-1"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => copyToClipboard(fullEditLink, setEditLinkCopied)}
              >
                {editLinkCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this link to edit your entry at any time, even if it's private.
            </p>
          </div>

          {isPublic && shareLink && (
            <div className="space-y-2">
              <Label htmlFor="share-link" className="flex items-center gap-2">
                <Link className="h-4 w-4" /> Share Link
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="share-link"
                  value={fullShareLink}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(fullShareLink, setShareLinkCopied)}
                >
                  {shareLinkCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Share this link with others to let them view your entry.
              </p>
            </div>
          )}

          {!isPublic && (
            <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                This entry is private. No public share link is available.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}