import { MolstarViewer } from "@/components/molstar/MolstarViewer";
import { useMolstar } from "@/context/MolstarContext";
import { useState } from "react";
import snapshotExample from "./snapshot-example.json" assert { type: "json" };
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";

type View = {
  name: string;
  description: string;
  snapshot: object;
};

export function ViewDemo() {
  const { viewer } = useMolstar();
  const [views, setViews] = useState<View[]>([
    {
      name: "Example snapshot",
      description: "description description description",
      snapshot: snapshotExample.entries[0].snapshot,
    },
  ]);

  function saveSnapshot() {
    const view: View = {
      name: "",
      description: "",
      snapshot: viewer.getState(),
    };
    setViews((prev) => [...prev, view]);
  }

  // add snapshot preview image
  // button for editing view name and descriptoin
  // button for deleting view
  return (
    <div className="h-screen w-screen p-3">
      <div className="flex flex-row gap-5">
        <div className="flex flex-col basis-1/4 gap-y-3">
          <button onClick={saveSnapshot}>Save snapshot</button>
          {views.map((view) => (
            <ViewItem key={view.snapshot.id} view={view} />
          ))}
        </div>
        <div className="h-[600px] w-[800px] grow">
          <MolstarViewer />
        </div>
      </div>
    </div>
  );
}

export function ViewItem({ view }: { view: View }) {
  const { viewer } = useMolstar();

  function loadSnapshot(view: View) {
    viewer.setState(view.snapshot as PluginState.Snapshot);
  }

  return (
    <>
      <div className="flex flex-col border">
        <span>{view.name}</span>
        <span className="text-xs">{view.description}</span>
        <button onClick={() => loadSnapshot(view)}>Load snapshot</button>
      </div>
    </>
  );
}
