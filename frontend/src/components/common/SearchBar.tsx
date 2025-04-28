import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, XIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { Form, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const formSchema = z.object({
  search_term: z.string(),
});

export function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "Search entries...",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search_term: "",
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <Form>
      <FormField
        name="search_term"
        control={form.control}
        render={() => (
          <FormItem className="flex w-full max-w-lg items-center space-x-2">
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
            <Button type="submit" onClick={handleSubmit}>
              Search
            </Button>
          </FormItem>
        )}
      />
    </Form>
  );
}
