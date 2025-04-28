// src/components/views/ViewsSidebar.tsx
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewResponse } from "@/lib/client";
import { Camera } from "lucide-react";
import { ViewCard } from "./ViewCard";

interface ViewsSidebarProps {
  entryId: string;
  views: ViewResponse[];
  currentViewId: string | null;
  onSaveView: () => void;
  onEditView: (view: ViewResponse) => void;
  onDeleteView: (viewId: string) => void;
}

export function ViewsSidebar({
  entryId,
  views,
  currentViewId,
  onSaveView,
  onEditView,
  onDeleteView,
}: ViewsSidebarProps) {
  return (
    <div className="flex flex-col h-full w-96">
      <div className="flex items-center justify-between mb-2 pr-4">
        <h2 className="text-xl font-bold">Saved Views</h2>
        <Button onClick={onSaveView} size="sm" className="gap-1">
          <Camera size={16} />
          <span>Save View</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0 pb-0 pr-4">
        <div className="flex flex-col gap-y-3">
          {views.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No views saved yet</p>
            </div>
          )}
          {views.map((view) => (
            <div key={view.id} className="transition-transform">
              <ViewCard
                entryId={entryId}
                view={view}
                isActive={currentViewId === view.id}
                onEdit={() => onEditView(view)}
                onDelete={() => onDeleteView(view.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
