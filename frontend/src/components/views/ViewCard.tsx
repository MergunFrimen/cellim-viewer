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
import { useMolstar } from "@/contexts/MolstarProvider";
import { ViewResponse } from "@/lib/client";
import { viewsGetViewSnapshotOptions } from "@/lib/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { Camera, Edit, GripVertical, MoreVertical, Trash2 } from "lucide-react";

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
  const { viewer } = useMolstar();

  const viewSnapshot = useQuery({
    ...viewsGetViewSnapshotOptions({
      path: {
        entry_id: entryId!,
        view_id: view.id!,
      },
    }),
    enabled: false, // don't run on mount
  });

  const handleLoadView = async () => {
    const { data } = await viewSnapshot.refetch();
    await viewer.loadSnapshot(data);
  };

  return (
    <Card
      className={`transition-all hover:shadow-md mr-0 ${isActive ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-x-2">
            <GripVertical
              size={16}
              className="text-muted-foreground cursor-grab"
            />
            <CardTitle className="text-base">{view.name}</CardTitle>
          </div>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Screenshot Preview */}
      <div className="px-6 pb-2">
        <div className="aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
          {view.thumbnail_url ? (
            <img
              src={`http://localhost:8000/api/v1/entries/${entryId}/views/${view.id}/thumbnail`}
              alt={`${view.name} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="h-8 w-8 text-muted-foreground" />
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
          <span>Load</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
