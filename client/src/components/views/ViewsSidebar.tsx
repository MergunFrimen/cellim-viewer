// src/components/views/ViewsSidebar.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { View } from "@/types";
import { Camera, Edit, MoreVertical, Trash2 } from "lucide-react";

interface ViewsSidebarProps {
  views: View[];
  currentViewId: string | null;
  onSaveView: () => void;
  onEditView: (view: View) => void;
  onLoadView: (view: View) => void;
  onDeleteView: (viewId: string) => void;
}

export function ViewsSidebar({
  views,
  currentViewId,
  onSaveView,
  onEditView,
  onLoadView,
  onDeleteView,
}: ViewsSidebarProps) {
  return (
    <div className="flex w-80 flex-col mr-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Saved Views</h2>
        <Button onClick={onSaveView} size="sm" className="gap-1">
          <Camera size={16} />
          <span>Save View</span>
        </Button>
      </div>

      <Separator className="mb-4" />

      <ScrollArea className="flex-grow pr-3">
        <div className="space-y-3">
          {views.map((view) => (
            <ViewCard
              key={view.id}
              view={view}
              isActive={currentViewId === view.id}
              onEdit={() => onEditView(view)}
              onLoad={() => onLoadView(view)}
              onDelete={() => onDeleteView(view.id)}
            />
          ))}
          {views.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No views saved yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ViewCardProps {
  view: View;
  isActive: boolean;
  onEdit: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

function ViewCard({ view, isActive, onEdit, onLoad, onDelete }: ViewCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md m-2 ${isActive ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{view.title}</CardTitle>
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
