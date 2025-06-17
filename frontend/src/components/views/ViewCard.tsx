import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthProvider";
import { useMolstar } from "@/contexts/MolstarProvider";
import { ViewResponse } from "@/lib/client";
import {
  viewsGetViewSnapshotOptions,
  viewsListViewsForEntryQueryKey,
  viewsUpdateViewMutation,
} from "@/lib/client/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, ImageIcon, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ViewCardProps {
  entryId: string;
  view: ViewResponse;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewCard({
  entryId,
  view,
  isActive,
  onEdit,
  onDelete,
}: ViewCardProps) {
  const { isAuthenticated } = useAuth();
  const { viewer } = useMolstar();
  const queryClient = useQueryClient();

  const viewSnapshot = useQuery({
    ...viewsGetViewSnapshotOptions({
      path: {
        entry_id: entryId!,
        view_id: view.id!,
      },
    }),
    enabled: false, // don't run on mount
  });

  const viewMutation = useMutation({
    ...viewsUpdateViewMutation(),
    onSuccess: (view) => {
      toast.success(`View "${view.name}" set a default thumbnail`);
      queryClient.invalidateQueries({
        queryKey: viewsListViewsForEntryQueryKey({
          path: { entry_id: entryId },
        }),
      });
    },
  });

  const handleLoadView = async () => {
    const { data } = await viewSnapshot.refetch();
    await viewer.loadSnapshot(data);
  };

  const onSetAsThumbnail = async () => {
    viewMutation.mutate({
      path: {
        entry_id: entryId,
        view_id: view.id,
      },
      body: {
        is_thumbnail: true,
      },
    });
  };

  return (
    <Card
      className={`transition-all hover:shadow-md mr-0 relative ${isActive ? "ring-2 ring-primary" : ""}`}
    >
      {/* Thumbnail Indicator */}
      {view.is_thumbnail && (
        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full z-10">
          Default
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-x-2">
            <CardTitle className="text-base">{view.name}</CardTitle>
          </div>
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
                {!view.is_thumbnail && (
                  <DropdownMenuItem onClick={onSetAsThumbnail}>
                    <ImageIcon size={14} className="mr-2" />
                    Set as Default Thumbnail
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      {/* Screenshot */}
      <div className="px-6 pb-2">
        <div className="aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
          {view.thumbnail_url ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/api/v1/entries/${entryId}/views/${view.id}/thumbnail`}
              alt={`${view.name} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
      </div>

      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {view.description}
        </p>
      </CardContent>
      <CardFooter className="justify-center pt-2">
        <Button
          onClick={handleLoadView}
          variant={isActive ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          Load
        </Button>
      </CardFooter>
    </Card>
  );
}
