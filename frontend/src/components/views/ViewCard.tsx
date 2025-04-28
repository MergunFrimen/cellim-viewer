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
import { ViewResponse } from "@/lib/client";
import { Camera, Edit, GripVertical, MoreVertical, Trash2 } from "lucide-react";

interface ViewCardProps {
  view: ViewResponse;
  isActive: boolean;
  screenshotUrl?: string;
  onEdit: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

export function ViewCard({
  view,
  isActive,
  screenshotUrl,
  onEdit,
  onLoad,
  onDelete,
}: ViewCardProps) {
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
          {screenshotUrl ? (
            <img
              src={screenshotUrl}
              alt={`Preview of ${view.name}`}
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
          onClick={onLoad}
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
