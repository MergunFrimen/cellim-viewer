import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface EntryDescriptionProps {
  description?: string | null;
}

export function EntryDescription({ description }: EntryDescriptionProps) {
  return (
    <Card className="mb-8">
      <CardContent className="px-2">
        <ScrollArea className="h-64 px-3">
          {description ? (
            <ReactMarkdown>{description}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
