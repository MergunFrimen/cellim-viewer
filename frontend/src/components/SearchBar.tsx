import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, XIcon } from "lucide-react";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "Search entries...",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg items-center space-x-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="px-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2.5 top-2.5 h-4 w-4"
            onClick={handleClear}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
