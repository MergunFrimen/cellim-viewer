import { useMolstar } from "@/contexts/MolstarProvider";
import { useBehavior } from "@/hooks/useBehavior";
import { useEffect } from "react";
import { ViewerLayout } from "./ViewerLayout";
import { LoaderCircleIcon } from "lucide-react";

export function MolstarViewer() {
  const { viewer } = useMolstar();

  const isInitialized = useBehavior(viewer.state.isInitialized);
  const isLoading = useBehavior(viewer.state.isLoading);

  useEffect(() => {
    viewer.init();
  }, [viewer]);

  return (
    <div className="relative size-full rounded-lg overflow-hidden">
      {/* {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform z-20">
          <LoaderCircleIcon className="w-6 h-6 animate-spin" />
        </div>
      )} */}

      {isInitialized && <ViewerLayout viewer={viewer} />}
    </div>
  );
}
