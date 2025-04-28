// src/components/views/ViewsSidebar.tsx
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewResponse } from "@/lib/client";
import { Camera, Edit, GripVertical, MoreVertical, Trash2 } from "lucide-react";

interface ViewsSidebarProps {
  views: ViewResponse[];
  currentViewId: string | null;
  screenshotUrls: Record<string, string>;
  onSaveView: () => void;
  onEditView: (view: ViewResponse) => void;
  onLoadView: (view: ViewResponse) => void;
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
}: ViewsSidebarProps) {
  return (
    <div className="flex flex-col h-full w-96">
      <div className="flex items-center justify-between mb-2 px-4">
        <h2 className="text-xl font-bold">Saved Views</h2>
        <Button onClick={onSaveView} size="sm" className="gap-1">
          <Camera size={16} />
          <span>Save View</span>
        </Button>
      </div>

      {/* Fixed ScrollArea - Set explicit height and make it fill available space */}
      <ScrollArea className="flex-1 min-h-0 px-2">
        <div className="pb-0">
          <DraggableViewList
            views={views}
            currentViewId={currentViewId}
            screenshotUrls={screenshotUrls}
            onEditView={onEditView}
            onLoadView={onLoadView}
            onDeleteView={onDeleteView}
          />
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

interface DraggableViewListProps {
  views: ViewResponse[];
  currentViewId: string | null;
  screenshotUrls: Record<string, string>;
  onEditView: (view: ViewResponse) => void;
  onLoadView: (view: ViewResponse) => void;
  onDeleteView: (viewId: string) => void;
}

function DraggableViewList({
  views,
  currentViewId,
  screenshotUrls,
  onEditView,
  onLoadView,
  onDeleteView,
}: DraggableViewListProps) {
  return (
    <div className="space-y-3">
      {views.map((view) => (
        <div key={view.id} className="transition-transform">
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
  view: ViewResponse;
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
      className={`transition-all hover:shadow-md mx-2 ${isActive ? "ring-2 ring-primary" : ""}`}
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
