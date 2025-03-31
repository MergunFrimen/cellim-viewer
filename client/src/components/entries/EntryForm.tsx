import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { entryFormSchema, EntryFormValues } from "@/lib/form-schemas";
import { Entry } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EntryFormProps {
  entry?: Entry;
  onSubmit: (data: EntryFormValues) => void;
  isLoading?: boolean;
}

export function EntryForm({
  entry,
  onSubmit,
  isLoading = false,
}: EntryFormProps) {
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: {
      name: entry?.name || "",
      description: entry?.description || "",
      author_email: entry?.author_email || "",
      thumbnail_path: entry?.thumbnail_path || "",
      is_public: entry?.is_public ?? true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? "Edit Entry" : "Create New Entry"}</CardTitle>
        <CardDescription>
          {entry
            ? "Update the details for this entry"
            : "Create a new entry in the database"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Entry name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A concise, descriptive name for this entry.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this entry (Markdown supported)"
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    A detailed description of this entry. Markdown formatting is
                    supported.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="author@example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail_path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Path (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/thumbnails/example.jpg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Path to a thumbnail image for this entry.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make entry public</FormLabel>
                    <FormDescription>
                      When enabled, this entry will be visible to everyone.
                      Otherwise, it will only be accessible via a private link.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : entry
                  ? "Update Entry"
                  : "Create Entry"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
