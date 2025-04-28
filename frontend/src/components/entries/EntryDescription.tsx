import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface EntryDescriptionProps {
  description?: string | null;
}

export function EntryDescription({ description }: EntryDescriptionProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {description ? (
            <ReactMarkdown>{description}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
