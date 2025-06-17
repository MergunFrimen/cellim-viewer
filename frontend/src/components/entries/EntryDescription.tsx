import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EntryDescriptionProps {
  description?: string | null;
}

export function EntryDescription({ description }: EntryDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Description</CardTitle>
          {/* Empty space or button could go here if needed */}
        </CardHeader>
        <CardContent className="px-2">
          <p className="text-muted-foreground italic">
            No description provided
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Description</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent-foreground rounded transition-colors"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse description" : "Expand description"}
        >
          {expanded ? "Collapse" : "Expand"}
          {expanded ? (
            <ChevronUpIcon className="ml-1 h-4 w-4 transition-transform" />
          ) : (
            <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform" />
          )}
        </Button>
      </CardHeader>

      <CardContent className="px-2">
        <ScrollArea
          className={expanded ? "h-auto max-h-none px-3" : "h-64 px-3"}
        >
          <ReactMarkdown>{description}</ReactMarkdown>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
