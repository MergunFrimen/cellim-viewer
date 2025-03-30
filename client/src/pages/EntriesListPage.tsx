import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { EntryCard } from "@/components/EntryCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { entriesApi } from "@/lib/api-client";
import { Entry } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function EntriesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Get search parameters
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");

  // State for delete confirmation
  const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);

  // Query for entries
  const { data, isLoading, error } = useQuery({
    queryKey: ["entries", { search, page, perPage }],
    queryFn: () => entriesApi.list({ search, page, per_page: perPage }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => entriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      setEntryToDelete(null);
    },
  });

  // Update search parameters
  const handleSearch = (searchTerm: string) => {
    setSearchParams({
      search: searchTerm,
      page: "1",
      per_page: perPage.toString(),
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      search,
      page: newPage.toString(),
      per_page: perPage.toString(),
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setSearchParams({ search, page: "1", per_page: newPerPage.toString() });
  };

  const handleDelete = (entry: Entry) => {
    setEntryToDelete(entry);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate(entryToDelete.id);
    }
  };

  return (
    <div className="py-8">
      <div className="flex flex-col justify-between items-start md:items-center mb-8 gap-4">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">CELLIM View</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse, search, and manage your CELLIM entries.
          </p>
        </section>

        <Button asChild>
          <Link to="/entries/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Entry
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          initialValue={search}
          onSearch={handleSearch}
          placeholder="Search by name or description..."
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading entries...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error loading entries. Please try again.
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-8">
          {search ? (
            <div>
              <p>No entries found matching "{search}"</p>
              <Button variant="link" onClick={() => handleSearch("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div>
              <p>No entries found. Create your first entry to get started.</p>
              <Button asChild variant="link" className="mt-2">
                <Link to="/entries/new">Create Entry</Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.items.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>

          {data && (
            <Pagination
              currentPage={data.page}
              totalPages={data.total_pages}
              totalItems={data.total}
              perPage={data.per_page}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </>
      )}

      <DeleteDialog
        title="Delete Entry"
        description={`Are you sure you want to delete "${entryToDelete?.name}"? This action cannot be undone.`}
        open={!!entryToDelete}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
