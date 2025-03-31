import { useBehavior } from "@/hooks/useBehavior";
import { cn } from "@/lib/utils";
import { MolstarViewerModel } from "@/models/molstar-viewer";
import { LeftPanelControls } from "molstar/lib/commonjs/mol-plugin-ui/left-panel";
import {
  ControlsWrapper,
  DefaultViewport,
  PluginContextContainer,
} from "molstar/lib/commonjs/mol-plugin-ui/plugin";
import { SequenceView } from "molstar/lib/commonjs/mol-plugin-ui/sequence";
import { useEffect } from "react";

export function ViewerLayout({ viewer }: { viewer: MolstarViewerModel }) {
  const showControls = useBehavior(viewer.state.showControls);
  const isExpanded = useBehavior(viewer.state.isExpanded);

  useEffect(() => {
    viewer.mount();
    return () => viewer.dispose();
  }, [viewer]);

  return (
    <div
      className={cn(
        "size-full",
        isExpanded ? "fixed inset-0 z-10" : "relative inset-auto z-auto",
      )}
    >
      <div className="flex flex-row size-full">
        {showControls && (
          <div className="grow relative max-w-[330px] h-full">
            <MolstarLeftPanelControlsView viewer={viewer} />
          </div>
        )}

        <div className="flex flex-col grow size-full">
          <div
            className={cn(
              "relative w-full",
              isExpanded ? "h-[100px]" : "h-[80px]",
            )}
          >
            <MolstarSequence viewer={viewer} />
          </div>
          <div className="relative grow">
            <MolstarViewport viewer={viewer} />
          </div>
        </div>

        {showControls && (
          <div className="relative max-w-[300px] h-full grow">
            <MolstarControlsView viewer={viewer} />
          </div>
        )}
      </div>
    </div>
  );
}

export function MolstarViewport({ viewer }: { viewer: MolstarViewerModel }) {
  const ViewportViewer =
    viewer.plugin.spec.components?.viewport?.view || DefaultViewport;

  return (
    <PluginContextContainer plugin={viewer.plugin}>
      <ViewportViewer />
    </PluginContextContainer>
  );
}

export function MolstarSequence({ viewer }: { viewer: MolstarViewerModel }) {
  const SequenceViewer =
    viewer.plugin.spec.components?.sequenceViewer?.view || SequenceView;

  return (
    <PluginContextContainer plugin={viewer.plugin}>
      <SequenceViewer />
    </PluginContextContainer>
  );
}

export function MolstarLeftPanelControlsView({
  viewer,
}: {
  viewer: MolstarViewerModel;
}) {
  return (
    <PluginContextContainer plugin={viewer.plugin}>
      <LeftPanelControls />
    </PluginContextContainer>
  );
}

export function MolstarControlsView({
  viewer,
}: {
  viewer: MolstarViewerModel;
}) {
  return (
    <PluginContextContainer plugin={viewer.plugin}>
      <ControlsWrapper />
    </PluginContextContainer>
  );
}
