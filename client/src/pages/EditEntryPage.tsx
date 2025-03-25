import { EntryForm } from "@/components/EntryForm";
import { entriesApi } from "@/lib/api-client";
import { EntryFormValues } from "@/lib/form-schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function EditEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const entryId = parseInt(id || "0");

  // Query for entry data
  const {
    data: entry,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["entry", entryId],
    queryFn: () => entriesApi.getById(entryId),
    enabled: !!entryId,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (data: EntryFormValues) => entriesApi.update(entryId, data),
    onSuccess: (updatedEntry) => {
      // Update the cache
      queryClient.setQueryData(["entry", entryId], updatedEntry);
      // Navigate back to entry details
      navigate(`/entries/${entryId}`);
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
