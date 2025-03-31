import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Trash2, View } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface EntryCardProps {
  entry: Entry;
  onDelete?: (entry: Entry) => void;
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const truncateDescription = (description: string | null) => {
    if (!description) return "";

    // Get the first paragraph or first 150 characters
    const firstParagraph = description.split("\n\n")[0];
    if (firstParagraph.length <= 150) return firstParagraph;

    return firstParagraph.substring(0, 150) + "...";
  };

  const createdAt = entry.created_at
    ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })
    : "Unknown";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{entry.name}</CardTitle>
            <CardDescription>Created {createdAt}</CardDescription>
          </div>
          {entry.is_public ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-300"
            >
              Public
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-300"
            >
              Private
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="prose prose-sm prose-gray dark:prose-invert">
          <ReactMarkdown>
            {truncateDescription(entry.description)}
          </ReactMarkdown>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/entries/${entry.id}`}>
            <View className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to={`/entries/${entry.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>

          {entry.is_public && entry.sharing_uuid && (
            <Button asChild variant="ghost" size="sm">
              <Link to={`/share/${entry.sharing_uuid}`}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Link>
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(entry)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
