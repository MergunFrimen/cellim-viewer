import { DeleteDialog } from "@/components/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entriesApi, viewsApi } from "@/lib/api-client";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  Mail,
  Share2,
  Trash2,
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const entryId = parseInt(id || "0");

  // Query for entry and its views
  const [entryQuery, viewsQuery] = useQueries({
    queries: [
      {
        queryKey: ["entry", entryId],
        queryFn: () => entriesApi.getById(entryId),
        enabled: !!entryId,
      },
      {
        queryKey: ["views", entryId],
        queryFn: () => viewsApi.listByEntry(entryId),
        enabled: !!entryId,
      },
    ],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => entriesApi.delete(entryId),
    onSuccess: () => {
      // Invalidate the entries list query
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      // Navigate back to entries list
      navigate("/entries");
    },
  });

  const entry = entryQuery.data;
  const views = viewsQuery.data || [];
  const isLoading = entryQuery.isLoading || viewsQuery.isLoading;
  const error = entryQuery.error || viewsQuery.error;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-8">Loading entry data...</div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container py-8">
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
          Entry not found or cannot be loaded. Please try again.
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/entries">Back to Entries</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return format(new Date(dateString), "PPP");
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/entries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Entries
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{entry.name}</h1>
              {entry.author_email && (
                <div className="flex items-center text-muted-foreground mt-2">
                  <Mail className="h-4 w-4 mr-2" />
                  {entry.author_email}
                </div>
              )}
            </div>

            {entry.is_public ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-300"
              >
                Public
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-300"
              >
                Private
              </Badge>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            Created on {formatDate(entry.created_at)}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {entry.description ? (
                  <ReactMarkdown>{entry.description}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Views</CardTitle>
              <CardDescription>
                {views.length} view{views.length !== 1 ? "s" : ""} available for
                this entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {views.length === 0 ? (
                <p className="text-muted-foreground italic">
                  No views available for this entry
                </p>
              ) : (
                <div className="space-y-4">
                  {views.map((view) => (
                    <div key={view.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{view.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {view.description}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to={`/entries/${entry.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Entry
                  </Link>
                </Button>

                {entry.is_public && entry.sharing_uuid && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to={`/share/${entry.sharing_uuid}`}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Entry
                    </Link>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteDialog
        title="Delete Entry"
        description={`Are you sure you want to delete "${entry.name}"? This action cannot be undone.`}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
