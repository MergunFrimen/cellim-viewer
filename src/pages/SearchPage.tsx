import { EntryPreview } from "@/components/EntryPreview";
import { Input } from "@/components/ui/input";
import { DatasetEntry } from "@/types";
import { Search } from "lucide-react";
import mockData from "../data/mock.json" with { type: "json" };
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";

export function SearchPage() {
  return (
    <div className="space-y-12">
      {/* Search */}
      <h1 className="text-3xl font-bold">Search</h1>
      <div className="flex flex-col gap-6 pt-4">
        <div className="relative max-w-md w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="search"
            placeholder="Search by keywords, e.g. 'neuronal', 'mitochondria'..."
            className="pl-10 pr-4 py-6"
          />
        </div>
      </div>

      {/* Paginated results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {mockData.map((entry: DatasetEntry) => (
          <EntryPreview entry={entry} />
        ))}
      </div>

      <PaginationDemo />
    </div>
  );
}

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
