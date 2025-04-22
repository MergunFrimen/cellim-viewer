import { useMolstar } from "@/contexts/MolstarProvider";
import { useBehavior } from "@/hooks/useBehavior";
import { useEffect } from "react";
import { ViewerLayout } from "./ViewerLayout";

import "./viewer.scss";

export function MolstarViewer() {
  const { viewer } = useMolstar();

  const isInitialized = useBehavior(viewer.state.isInitialized);

  useEffect(() => {
    viewer.init();
  }, [viewer]);

  if (isInitialized)
    return (
      <div className="relative size-full">
        {isInitialized && <ViewerLayout viewer={viewer} />}
      </div>
    );
}
