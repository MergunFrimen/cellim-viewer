import { Badge } from "../ui/badge";

interface VisibilityBadgeProps {
  isPublic: boolean;
}

export function VisibilityBadge({ isPublic }: VisibilityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={
        isPublic
          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      }
    >
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
}
