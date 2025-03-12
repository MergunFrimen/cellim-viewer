import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Entry } from "@/types";
import { ImageIcon, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function EntryPreview({ entry }: { entry: Entry }) {
  return (
    <Card
      key={entry.id}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video bg-secondary flex items-center justify-center">
        <ImageIcon size={64} className="text-muted-foreground" />
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2">{entry.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {entry.description}
        </p>
        {/* <div className="flex flex-wrap gap-2 mb-4">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="default" size="sm" asChild>
          <Link to={`/entry/${entry.id}`}>View Details</Link>
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 size={16} className="mr-2" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
}
