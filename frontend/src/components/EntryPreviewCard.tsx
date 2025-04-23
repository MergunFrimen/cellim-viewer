import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import React from "react";

export interface Link {
  id: string;
  is_editable: boolean;
  is_active: boolean;
}

export interface View {
  // Define view properties if needed
  // This is a placeholder since the views array was empty in your data
}

export interface EntryCardProps {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  thumbnail_url: string | null;
  is_public?: boolean;
  link?: Link;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  created_at,
  updated_at,
  name,
  description,
  thumbnail_url,
  is_public,
}) => {
  // Format dates for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-md overflow-hidden">
      {thumbnail_url && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-xl font-semibold">{name}</h3>
        {is_public && (
          <Badge variant={is_public ? "default" : "secondary"}>
            {is_public ? "Public" : "Private"}
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <div className="aspect-video bg-secondary flex items-center justify-center">
          <ImageIcon size={64} className="text-muted-foreground" />
        </div>
        <div className="text-sm">{description}</div>
      </CardContent>

      <CardFooter>
        <div className="grid grid-cols-2 text-xs">
          <span>Created:</span>
          <span>{formatDate(created_at)}</span>
          <span>Updated:</span>
          <span>{formatDate(updated_at)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
