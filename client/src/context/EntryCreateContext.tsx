import { createContext, useContext, useState, ReactNode } from "react";
import { EntryCreateDialog } from "@/components/dialogs/CreateEntryDialog";

type EntryCreateContextType = {
  openCreateDialog: () => void;
};

const EntryCreateContext = createContext<EntryCreateContextType | undefined>(
  undefined,
);

export function EntryCreateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCreateDialog = () => {
    setIsOpen(true);
  };

  return (
    <EntryCreateContext.Provider value={{ openCreateDialog }}>
      {children}
      <EntryCreateDialog open={isOpen} onOpenChange={setIsOpen} />
    </EntryCreateContext.Provider>
  );
}

export function useEntryCreate() {
  const context = useContext(EntryCreateContext);
  if (!context) {
    throw new Error(
      "useEntryCreate must be used within an EntryCreateProvider",
    );
  }
  return context;
}
