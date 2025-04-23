import { useState } from "react";
import { EntryCreateDialog } from "./components/entries/EntryCreateDialog";
import { Button } from "./components/ui/button";

export function TestArea() {
  const [open, setOpen] = useState(true);
  return (
    <div className="size-full">
      <EntryCreateDialog open={open} onOpenChange={setOpen} />
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
    </div>
  );
}
