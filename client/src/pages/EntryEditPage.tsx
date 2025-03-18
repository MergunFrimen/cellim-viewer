import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Type definitions
interface View {
  id: number;
  title: string;
  description: string;
  mvsj: any;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

interface Entry {
  id: number;
  name: string;
  description: string | null;
  author_email: string | null;
  thumbnail_path: string | null;
  is_public: boolean;
  sharing_uuid: string;
  edit_uuid: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  views: View[];
}

const MOCK_ENTRY: Entry = {
  id: 123,
  name: "Sample Entry",
  description: "This is a sample entry description for development purposes.",
  author_email: "developer@example.com",
  thumbnail_path: "/images/sample-thumbnail.jpg",
  is_public: true,
  sharing_uuid: "share-abc-123-xyz-789",
  edit_uuid: "edit-def-456-uvw-012",
  created_at: "2025-03-10T14:30:00Z",
  updated_at: "2025-03-15T09:45:00Z",
  deleted_at: null,
  views: [
    {
      id: 1,
      title: "Main Dashboard",
      description: "Overview of key metrics and performance indicators",
      mvsj: { type: "dashboard", widgets: ["chart", "counter", "table"] },
      created_at: "2025-03-11T10:00:00Z",
      updated_at: null,
      deleted_at: null,
    },
    {
      id: 2,
      title: "Data Explorer",
      description:
        "Interactive visualization for exploring dataset relationships",
      mvsj: { type: "explorer", config: { allowExport: true, maxDepth: 3 } },
      created_at: "2025-03-12T15:20:00Z",
      updated_at: "2025-03-14T11:30:00Z",
      deleted_at: null,
    },
  ],
};

// Zod schema for form validation
const entryFormSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  description: z.string().nullable().optional(),
  author_email: z.string().email("Invalid email format").nullable().optional(),
  thumbnail_path: z.string().url().nullable().optional(),
  is_public: z.boolean().default(false),
  sharing_uuid: z.string(),
  edit_uuid: z.string(),
});

type EntryFormValues = z.infer<typeof entryFormSchema>;

export function EntryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for handling loading and errors (to mimic React Query behavior)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set up form with React Hook Form and Zod validation
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      author_email: "",
      thumbnail_path: "",
      is_public: false,
      sharing_uuid: "",
      edit_uuid: "",
    },
  });

  // Update form with entry data when it's loaded
  useEffect(() => {
    // Simulate API request delay
    const timer = setTimeout(() => {
      try {
        // In a real app, you would fetch based on the ID
        // For now, we'll just use our mock data
        setEntry(MOCK_ENTRY);
        setIsLoading(false);
      } catch (e) {
        setError(new Error("Failed to fetch entry"));
        setIsLoading(false);
      }
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (entry) {
      form.reset({
        id: entry.id,
        name: entry.name,
        description: entry.description || "",
        author_email: entry.author_email || "",
        thumbnail_path: entry.thumbnail_path || "",
        is_public: entry.is_public,
        sharing_uuid: entry.sharing_uuid,
        edit_uuid: entry.edit_uuid,
      });
    }
  }, [entry, form]);

  const handleUpdate = (values: EntryFormValues) => {
    setIsUpdating(true);

    // Simulate API request delay
    setTimeout(() => {
      // Update local state to reflect changes
      if (entry) {
        const updatedEntry = {
          ...entry,
          ...values,
          updated_at: new Date().toISOString(),
        };
        setEntry(updatedEntry);
      }

      setIsUpdating(false);
      toast.success("Entry successfully updated");
    }, 1000);
  };

  const handleDelete = () => {
    setIsDeleting(true);

    // Simulate API request delay
    setTimeout(() => {
      setIsDeleting(false);
      toast.success("Entry successfully deleted");
      navigate("/entries"); // Navigate to entries list
    }, 1000);
  };

  const onSubmit = (values: EntryFormValues) => {
    handleUpdate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Entry</CardTitle>
          <CardDescription>
            Update the details of this entry or delete it entirely.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        {...field}
                        value={field.value || ""}
                        placeholder="Enter a description..."
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
                    <FormLabel>Author Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="email"
                        placeholder="author@example.com"
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
                    <FormLabel>Thumbnail Path</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="/images/thumbnail.jpg"
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Public Entry</FormLabel>
                      <p className="text-sm text-gray-500">
                        Make this entry visible to the public
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sharing_uuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sharing UUID</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="edit_uuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edit UUID</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {entry && (
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p>
                      Created: {format(new Date(entry.created_at), "PPP p")}
                    </p>
                    {entry.updated_at && (
                      <p>
                        Updated: {format(new Date(entry.updated_at), "PPP p")}
                      </p>
                    )}
                  </div>
                  {entry.views && (
                    <div>
                      <p>Associated Views: {entry.views.length}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button type="submit" disabled={isUpdating} className="w-32">
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      Delete Entry
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this entry and all associated views.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </Form>
        </CardContent>

        {entry && entry.views && entry.views.length > 0 && (
          <CardFooter className="flex flex-col">
            <h3 className="text-lg font-medium mb-2">Associated Views</h3>
            <div className="grid gap-2 w-full">
              {entry.views.map((view) => (
                <div key={view.id} className="border rounded-md p-3">
                  <h4 className="font-medium">{view.title}</h4>
                  <p className="text-sm text-gray-500">{view.description}</p>
                </div>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
