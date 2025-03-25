import { EntryForm } from "@/components/EntryForm";
import { ShareLinkDialog } from "@/components/ShareLinkDialog";
import { entriesApi } from "@/lib/api-client";
import { EntryFormValues } from "@/lib/form-schemas";
import { Entry } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateEntryPage() {
  const navigate = useNavigate();
  const [createdEntry, setCreatedEntry] = useState<Entry | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: EntryFormValues) => entriesApi.create(data),
    onSuccess: (entry) => {
      // Store the created entry and show the dialog
      setCreatedEntry(entry);
      setShowLinkDialog(true);
    },
  });

  const handleSubmit = (data: EntryFormValues) => {
    mutation.mutate(data);
  };

  const handleDialogClose = () => {
    setShowLinkDialog(false);
    // Navigate to the entry details page after closing dialog
    if (createdEntry) {
      navigate(`/entries/${createdEntry.id}`);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Entry</h1>

      <EntryForm onSubmit={handleSubmit} isLoading={mutation.isPending} />

      {mutation.error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
          {mutation.error.message ||
            "An error occurred while creating the entry. Please try again."}
        </div>
      )}

      {createdEntry && (
        <ShareLinkDialog
          open={showLinkDialog}
          onOpenChange={handleDialogClose}
          entryName={createdEntry.name}
          editLink={createdEntry.edit_uuid || ""}
          shareLink={createdEntry.sharing_uuid || undefined}
          isPublic={createdEntry.is_public}
        />
      )}
    </div>
  );
}
