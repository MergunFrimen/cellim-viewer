import { EntryForm } from "@/components/EntryForm";
import { entriesApi } from "@/lib/api-client";
import { EntryFormValues } from "@/lib/form-schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function EditEntryPage() {
  const params = useParams<{ id?: string; uuid?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isUuidMode = !!params.uuid;
  const entryId = params.id ? parseInt(params.id) : undefined;
  const editUuid = params.uuid;

  // Determine which API function to use based on route
  const fetchEntry = async () => {
    if (isUuidMode && editUuid) {
      return entriesApi.getByEdit(editUuid);
    } else if (entryId) {
      return entriesApi.getById(entryId);
    }
    throw new Error("Invalid route parameters");
  };

  // Query for entry data
  const {
    data: entry,
    isLoading,
    error,
  } = useQuery({
    queryKey: isUuidMode ? ["entry", "edit", editUuid] : ["entry", entryId],
    queryFn: fetchEntry,
    enabled: !!(isUuidMode ? editUuid : entryId),
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (data: EntryFormValues) => {
      if (!entry) throw new Error("Entry not found");
      return entriesApi.update(entry.id, data);
    },
    onSuccess: (updatedEntry) => {
      // Update the cache
      if (isUuidMode) {
        queryClient.setQueryData(["entry", "edit", editUuid], updatedEntry);
      } else {
        queryClient.setQueryData(["entry", entryId], updatedEntry);
      }

      // Navigate back to entry details
      navigate(`/entries/${updatedEntry.id}`);
    },
  });

  const handleSubmit = (data: EntryFormValues) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Entry</h1>
        <div className="text-center py-8">Loading entry data...</div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Entry</h1>
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
          {error instanceof Error
            ? error.message
            : "Entry not found or cannot be loaded. Please try again."}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Entry</h1>

      <EntryForm
        entry={entry}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />

      {mutation.error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "An error occurred while updating the entry. Please try again."}
        </div>
      )}
    </div>
  );
}
