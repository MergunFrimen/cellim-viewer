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
import { Camera, Edit, GripVertical, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ViewsSidebarProps {
  views: View[];
  currentViewId: string | null;
  screenshotUrls: Record<string, string>;
  onSaveView: () => void;
  onEditView: (view: View) => void;
  onLoadView: (view: View) => void;
  onDeleteView: (viewId: string) => void;
  onReorderViews: (sourceIndex: number, destinationIndex: number) => void;
}

export function ViewsSidebar({
  views,
  currentViewId,
  screenshotUrls,
  onSaveView,
  onEditView,
  onLoadView,
  onDeleteView,
  onReorderViews,
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
        <DraggableViewList
          views={views}
          currentViewId={currentViewId}
          screenshotUrls={screenshotUrls}
          onEditView={onEditView}
          onLoadView={onLoadView}
          onDeleteView={onDeleteView}
          onReorderViews={onReorderViews}
        />
        {views.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No views saved yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface DraggableViewListProps {
  views: View[];
  currentViewId: string | null;
  screenshotUrls: Record<string, string>;
  onEditView: (view: View) => void;
  onLoadView: (view: View) => void;
  onDeleteView: (viewId: string) => void;
  onReorderViews: (sourceIndex: number, destinationIndex: number) => void;
}

function DraggableViewList({
  views,
  currentViewId,
  screenshotUrls,
  onEditView,
  onLoadView,
  onDeleteView,
  onReorderViews,
}: DraggableViewListProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDragEnd = () => {
    if (
      draggedItem !== null &&
      dragOverItem !== null &&
      draggedItem !== dragOverItem
    ) {
      onReorderViews(draggedItem, dragOverItem);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="space-y-3">
      {views.map((view, index) => (
        <div
          key={view.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={cn(
            "transition-transform",
            draggedItem === index && "opacity-50",
            dragOverItem === index &&
              "border-2 border-primary border-dashed rounded-xl",
          )}
        >
          <ViewCard
            view={view}
            isActive={currentViewId === view.id}
            screenshotUrl={screenshotUrls[view.id]}
            onEdit={() => onEditView(view)}
            onLoad={() => onLoadView(view)}
            onDelete={() => onDeleteView(view.id)}
          />
        </div>
      ))}
    </div>
  );
}

interface ViewCardProps {
  view: View;
  isActive: boolean;
  screenshotUrl?: string;
  onEdit: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

function ViewCard({
  view,
  isActive,
  screenshotUrl,
  onEdit,
  onLoad,
  onDelete,
}: ViewCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md m-2 ${isActive ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <GripVertical
              size={16}
              className="text-muted-foreground cursor-grab"
            />
            <CardTitle className="text-base">{view.title}</CardTitle>
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
              alt={`Preview of ${view.title}`}
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
