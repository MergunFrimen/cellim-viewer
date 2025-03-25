import { EntryForm } from "@/components/EntryForm";
import { entriesApi } from "@/lib/api-client";
import { EntryFormValues } from "@/lib/form-schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function CreateEntryPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: EntryFormValues) => entriesApi.create(data),
    onSuccess: (entry) => {
      // Navigate to the entry details page
      navigate(`/entries/${entry.id}`);
    },
  });

  const handleSubmit = (data: EntryFormValues) => {
    mutation.mutate(data);
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
    </div>
  );
}
