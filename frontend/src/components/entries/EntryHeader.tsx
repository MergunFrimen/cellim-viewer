import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EntryHeaderProps {
  name: string;
  isPublic: boolean;
  createdAt: string;
}

export function EntryHeader({ name, isPublic, createdAt }: EntryHeaderProps) {
  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <Badge variant="outline">{isPublic ? "Public" : "Private"}</Badge>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Calendar className="h-4 w-4 mr-2" />
        Created on {formatDate(createdAt)}
      </div>
    </div>
  );
}
