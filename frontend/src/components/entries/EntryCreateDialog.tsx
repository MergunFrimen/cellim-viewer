import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  EntriesCreateEntryError,
} from "@/lib/client";
import { entriesCreateEntryMutation } from "@/lib/client/@tanstack/react-query.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useState } from "react";

export function EntryCreateDialog() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false);
      navigate(`/entries/${entry.id}`);
    },
    onError: () => {
      toast.error("Failed to create entry: ");
    },
  });

  const handleSubmit = (data: EntryCreateRequest) => {
    mutation.mutate({
      body: data,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Create Entry
        </Button>
      </DialogTrigger>

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
                    {mutation.error.detail ? (
                      Array.isArray(mutation.error.detail) ? (
                        mutation.error.detail.map((error, index) => (
                          <div key={index}>{error.msg}</div>
                        ))
                      ) : (
                        <div>{mutation.error.detail}</div>
                      )
                    ) : (
                      <div>An unknown error occurred</div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <DialogFooter className="gap-2 pt-4">
                <Button type="submit" disabled={!mutation.isIdle}>
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
