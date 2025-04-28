import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { EntryDetailsResponse } from "@/lib/client";

export function EntryPreview({ entry }: { entry: EntryDetailsResponse }) {
  return (
    <Card
      key={entry.id}
      className="overflow-hidden hover:shadow-lg transition-shadow min-h-72"
    >
      <div className="aspect-video bg-secondary flex items-center justify-center">
        <ImageIcon size={64} className="text-muted-foreground" />
      </div>
      <CardContent className="flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2">{entry.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-4 overflow-hidden text-ellipsis">
          {entry.description}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/entries/${entry.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
