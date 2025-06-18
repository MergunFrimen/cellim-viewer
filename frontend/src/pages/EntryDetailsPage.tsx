import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { DeleteDialog } from "@/components/common/DeleteDialog";
import { EntryDescription } from "@/components/entries/EntryDescription";
import { EntryHeader } from "@/components/entries/EntryHeader";
import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { ViewCreateDialog } from "@/components/views/ViewCreateDialog";
import { ViewsSidebar } from "@/components/views/ViewSidebar";
import { useMolstar } from "@/contexts/MolstarProvider";
import { useEntryDetails } from "@/hooks/useEntryDetails";
import { useEntryViews } from "@/hooks/useEntryViews";
import { useRequiredParam } from "@/hooks/useRequiredParam";
import { volsegEntriesGetEntryByIdOptions } from "@/lib/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";

export function EntryDetailsPage() {
  const { isAuthenticated } = useAuth();

  const entryId = useRequiredParam("entryId");
  const { viewer } = useMolstar();

  const {
    entry,
    isLoading: isEntryLoading,
    error: entryError,
  } = useEntryDetails(entryId);

  const {
    views,
    currentViewId,
    isViewsLoading,
    viewsError,
    handleSaveView,
    handleEditView,
    handleDeleteView,
    showSaveDialog,
    setShowSaveDialog,
    viewToEdit,
    setViewToEdit,
    viewToDelete,
    setViewToDelete,
    updateViewMutation,
  } = useEntryViews(entryId);

  const volsegGetEntryMutation = useQuery({
    ...volsegEntriesGetEntryByIdOptions({
      path: {
        volseg_entry_id: entry?.volseg_entry_id,
      },
    }),
    enabled: !!entry,
  });

  async function loadVolseg() {
    const entryId = volsegGetEntryMutation.data?.entry_id;
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
  }, [viewer, volsegGetEntryMutation.data?.entry_id]);

  if (isEntryLoading || isViewsLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-8">Loading entry data...</div>
      </div>
    );
  }

  if (entryError || viewsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {entryError?.message || viewsError?.message || "Failed to load data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <div className="container py-8">
      {/* Entry Header Section */}
      <EntryHeader
        name={entry.name}
        isPublic={entry.is_public}
        createdAt={entry.created_at}
      />
      {/* Entry Description Section */}
      <EntryDescription description={entry.description} />
      <div className="flex flex-1 overflow-hidden gap-x-3">
        <aside className="overflow-hidden flex flex-col h-[80vh]">
          <ViewsSidebar
            entryId={entryId}
            views={views}
            currentViewId={currentViewId}
            onSaveView={() => setShowSaveDialog(true)}
            onEditView={handleEditView}
            onDeleteView={handleDeleteView}
          />
        </aside>
        <div className="flex-1 relative">
          <MolstarViewer />
        </div>
      </div>

      {isAuthenticated && (
        <>
          <ViewCreateDialog
            entry={entry}
            open={showSaveDialog}
            setOpen={setShowSaveDialog}
          />

          <DeleteDialog
            title="Delete View"
            description={`Are you sure you want to delete "${viewToDelete?.name}"? This action cannot be undone.`}
            open={!!viewToDelete}
            onOpenChange={(open) => !open && setViewToDelete(null)}
            onConfirm={() => {
              if (viewToDelete) {
                handleDeleteView(viewToDelete.id);
                setViewToDelete(null);
              }
            }}
          />
        </>
      )}

      {/* <DeleteDialog
        title="Delete Entry"
        description="Are you sure you want to delete this entry? This action cannot be undone."
        open={isDeleting}
        onOpenChange={(open) => !open && handleDeleteEntry(false)}
        onConfirm={() => handleDeleteEntry(true)}
        isLoading={isDeleting}
      /> */}
    </div>
  );
}
