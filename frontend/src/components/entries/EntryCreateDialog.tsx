import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  EntriesCreateEntryResponse,
  EntryCreateRequest,
  zEntryCreateRequest,
} from "@/lib/client";
import { entriesCreateEntryMutation } from "@/lib/client/@tanstack/react-query.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface EntryCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EntryCreateDialog({
  open,
  onOpenChange,
}: EntryCreateDialogProps) {
  const navigate = useNavigate();

  const form = useForm<EntryCreateRequest>({
    resolver: zodResolver(zEntryCreateRequest),
    defaultValues: {
      name: "",
      description: "",
      is_public: false,
    },
  });

  const mutation = useMutation({
    ...entriesCreateEntryMutation(),
    onSuccess: (entry: EntriesCreateEntryResponse) => {
      toast.success(`Entry "${entry.name}" created successfully`);
      onOpenChange(false);
      navigate(`/entries/${entry.id}`);
    },
    onError: (error) => {
      toast.error(
        "Failed to create entry: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
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
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1">
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
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : "An error occurred while creating the entry. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <DialogFooter className="gap-2 pt-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Creating..." : "Create Entry"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
