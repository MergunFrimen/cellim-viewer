import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { VisibilityBadge } from "@/components/common/VisibilityBadge";
import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewCreateDialog } from "@/components/views/ViewCreateDialog";
import { ViewsSidebar } from "@/components/views/ViewSidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useMolstar } from "@/contexts/MolstarProvider";
import { useRequiredParam } from "@/hooks/useRequiredParam";
import {
  entriesGetEntryByIdOptions,
  volsegEntriesGetEntryByIdOptions,
} from "@/lib/client/@tanstack/react-query.gen";
import { formatDate } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function EntryDetailsPage() {
  const { viewer } = useMolstar();
  const { isAuthenticated } = useAuth();
  const entryId = useRequiredParam("entryId");

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const entryQuery = useQuery({
    ...entriesGetEntryByIdOptions({
      path: {
        entry_id: entryId!,
      },
    }),
    enabled: !!entryId,
  });

  const volsegMutation = useQuery({
    ...volsegEntriesGetEntryByIdOptions({
      path: {
        volseg_entry_id: entryQuery.data?.volseg_entry_id,
      },
    }),
    enabled: !!entryQuery.data,
  });

  async function loadVolseg() {
    const entryId = volsegMutation.data?.entry_id;
    if (!entryId) return;
    await viewer.clear();
    await viewer.loadVolseg(entryId);
  }

  // Clear viewer when unmounting
  useEffect(() => {
    loadVolseg();
    return () => {
      viewer.clear();
    };
  }, [viewer, volsegMutation.data?.entry_id]);

  if (entryQuery.isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-8">Loading entry data...</div>
      </div>
    );
  }

  if (entryQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {entryQuery.error.message || "Failed to load data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!entryQuery.data) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="md:col-span-2">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{entryQuery.data.name}</h1>
          <VisibilityBadge isPublic={entryQuery.data.is_public} />
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Created on {formatDate(entryQuery.data.created_at)}
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Description</CardTitle>
          {entryQuery.data.description && (
            <Button
              variant="ghost"
              size="sm"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent-foreground rounded transition-colors"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Collapse" : "Expand"}
              {expanded ? (
                <ChevronUpIcon className="ml-1 h-4 w-4 transition-transform" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform" />
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {entryQuery.data.description ? (
            <ScrollArea className={expanded ? "h-64" : "h-auto max-h-none"}>
              <ReactMarkdown>{entryQuery.data.description}</ReactMarkdown>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-1 overflow-hidden gap-x-3">
        <aside className="overflow-hidden flex flex-col h-[80vh]">
          <ViewsSidebar
            entryId={entryId}
            isEditable={isAuthenticated}
            onSaveView={() => setShowSaveDialog(true)}
          />
        </aside>
        <div className="flex-1 relative">
          <MolstarViewer />
        </div>
      </div>

      {isAuthenticated && (
        <>
          <ViewCreateDialog
            entry={entryQuery.data}
            open={showSaveDialog}
            setOpen={setShowSaveDialog}
          />
        </>
      )}
    </div>
  );
}
