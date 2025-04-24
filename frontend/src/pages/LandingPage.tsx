// src/pages/LandingPage.tsx
import { PaginationControls } from "@/components/common/Pagination";
import { SearchBar } from "@/components/common/SearchBar";
import { EntryCreateDialog } from "@/components/entries/EntryCreateDialog";
import { EntryPreview } from "@/components/entries/EntryPreview";
import { Button } from "@/components/ui/button";
import { entriesListEntries } from "@/lib/client";
import { entriesListEntriesOptions } from "@/lib/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get search parameters
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10"); // Show fewer items on homepage

  // Query for entries
  const { data, isLoading, error } = useQuery({
    ...entriesListEntriesOptions(),
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

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 mt-16">
        <h1 className="text-4xl md:text-5xl font-bold">CELLIM Viewer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced visualization platform for cellular and molecular data from
          the CELLIM research group
        </p>
        <div className="max-w-lg mx-auto mt-8">
          <SearchBar
            initialValue={search}
            onSearch={handleSearch}
            placeholder="Search by name or description..."
          />
        </div>
      </section>

      {/* Entries/Visualizations Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {search
              ? `Search Results for "${search}"`
              : "Featured Visualizations"}
          </h2>
          <Button variant="secondary" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Entry
          </Button>
          <EntryCreateDialog open={isOpen} onOpenChange={setIsOpen} />
        </div>

        {isLoading && (
          <div className="text-center py-12">Loading entries...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">
            Error loading entries. Please try again.
          </div>
        )}
        {data?.items.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            {search && (
              <div>
                <p>No entries found matching "{search}"</p>
                <Button variant="link" onClick={() => handleSearch("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
        {data?.items.length !== 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data?.items.map((entry) => (
                <EntryPreview key={entry.id} entry={entry} />
              ))}
            </div>

            {data && (
              <PaginationControls
                currentPage={data.current_page}
                totalPages={data.total_pages}
                totalItems={data.total_items}
                perPage={data.per_page}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
