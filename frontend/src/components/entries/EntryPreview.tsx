import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Entry } from "@/types";
import { ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function EntryPreview({ entry }: { entry: Entry }) {
  return (
    <Card
      key={entry.id}
      className="overflow-hidden hover:shadow-lg transition-shadow min-h-96"
    >
      <div className="aspect-video bg-secondary flex items-center justify-center">
        <ImageIcon size={64} className="text-muted-foreground" />
      </div>
      <CardContent className="grow">
        <h3 className="font-bold text-lg">{entry.name}</h3>
        <p className="text-muted-foreground text-sm">{entry.description}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/entries/${entry.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
