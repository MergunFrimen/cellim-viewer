import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ShareLinkDialog } from "@/components/dialogs/ShareLinkDialog";
import { entriesApi } from "@/lib/api-client";
import { entryFormSchema, EntryFormValues } from "@/lib/form-schemas";
import { Entry } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EntryCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EntryCreateDialog({
  open,
  onOpenChange,
}: EntryCreateDialogProps) {
  const navigate = useNavigate();
  const [createdEntry, setCreatedEntry] = useState<Entry | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  // Set up the form
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      author_email: "",
      thumbnail_path: "",
      is_public: true,
    },
  });

  // Create entry mutation
  const mutation = useMutation({
    mutationFn: (data: EntryFormValues) => entriesApi.create(data),
    onSuccess: (entry) => {
      // Store the created entry and show the share dialog
      setCreatedEntry(entry);
      setShowLinkDialog(true);
      toast.success(`Entry "${entry.name}" created successfully`);
    },
    onError: (error) => {
      toast.error(
        "Failed to create entry: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  const handleSubmit = (data: EntryFormValues) => {
    mutation.mutate(data);
  };

  const handleDialogClose = () => {
    form.reset(); // Reset form on close
    onOpenChange(false);
  };

  const handleShareDialogClose = () => {
    setShowLinkDialog(false);
    // Navigate to the entry details page after closing dialog
    if (createdEntry) {
      navigate(`/entries/${createdEntry.id}`);
      // Also close the create dialog
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Entry</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Entry name" {...field} />
                      </FormControl>
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
                          Otherwise, it will only be accessible via a private
                          link.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {mutation.error && (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : "An error occurred while creating the entry. Please try again."}
                  </div>
                )}

                <DialogFooter className="gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Creating..." : "Create Entry"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {createdEntry && (
        <ShareLinkDialog
          open={showLinkDialog}
          onOpenChange={handleShareDialogClose}
          entryName={createdEntry.name}
          editLink={createdEntry.edit_uuid || ""}
          shareLink={createdEntry.sharing_uuid || undefined}
          isPublic={createdEntry.is_public}
        />
      )}
    </>
  );
}
