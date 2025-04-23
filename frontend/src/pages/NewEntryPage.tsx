import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  EntryCreateRequest,
  HttpValidationError,
  PrivateEntryDetailsResponse,
  zEntryCreateRequest,
} from "@/lib/client";
import { entriesCreateEntryMutation } from "@/lib/client/@tanstack/react-query.gen";
import { AlertCircle } from "lucide-react";

export function NewEntryPage() {
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
    onSuccess: (createdEntry: PrivateEntryDetailsResponse) => {
      toast.success("Entry created successfully!");
      navigate(`/entries/${createdEntry.id}`);
    },
    onError: (error: HttpValidationError) => {
      console.error("Error creating entry:", error);
      toast.error("Failed to create entry. Please try again.");
    },
  });

  const onSubmit = async (values: EntryCreateRequest) => {
    mutation.mutate({
      body: {
        name: values.name,
        description: values.description || null,
        is_public: values.is_public,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Entry</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="items-center">
                    <span>Name</span>
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title that will be displayed for your entry.
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
                      className="min-h-64"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional Markdown description for your entry.
                  </FormDescription>
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
                      <p>
                        When enabled, this entry will be visible to everyone.
                      </p>
                      <p>
                        Otherwise, it will only be accessible via a private
                        link.
                      </p>
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
          </CardContent>

          <CardFooter className="flex justify-end gap-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Entry"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
