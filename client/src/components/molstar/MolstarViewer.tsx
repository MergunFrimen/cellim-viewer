import { ViewerLayout } from "./ViewerLayout";
import { useMolstar } from "@/context/MolstarContext";
import { useBehavior } from "@/hooks/useBehavior";
import { useEffect } from "react";

import "molstar/lib/mol-plugin-ui/skin/light.scss";

export function MolstarViewer() {
  const { viewer } = useMolstar();

  const isInitialized = useBehavior(viewer.state.isInitialized);
  // const isLoading = useBehavior(viewer.state.isLoading);

  useEffect(() => {
    if (!isInitialized) viewer.init();
  }, [isInitialized, viewer]);

  return (
    <div className="relative size-full">
      {/* {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform-[translate(-50%, -50%)] z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )} */}
      {isInitialized && <ViewerLayout viewer={viewer} />}
    </div>
  );
}
