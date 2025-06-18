import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { EntryDescription } from "@/components/entries/EntryDescription";
import { EntryHeader } from "@/components/entries/EntryHeader";
import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { ViewCreateDialog } from "@/components/views/ViewCreateDialog";
import { ViewsSidebar } from "@/components/views/ViewSidebar";
import { useMolstar } from "@/contexts/MolstarProvider";
import { useRequiredParam } from "@/hooks/useRequiredParam";
import {
  entriesGetEntryByIdOptions,
  volsegEntriesGetEntryByIdOptions,
} from "@/lib/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";

export function EntryDetailsPage() {
  const { viewer } = useMolstar();
  const { isAuthenticated } = useAuth();
  const entryId = useRequiredParam("entryId");

  const [showSaveDialog, setShowSaveDialog] = useState(false);

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
      {/* Entry Header Section */}
      <EntryHeader
        name={entryQuery.data.name}
        isPublic={entryQuery.data.is_public}
        createdAt={entryQuery.data.created_at}
      />
      {/* Entry Description Section */}
      <EntryDescription description={entryQuery.data.description} />
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
