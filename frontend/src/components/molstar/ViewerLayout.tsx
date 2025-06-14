import { useBehavior } from "@/hooks/useBehavior";
import { MolstarViewerModel } from "@/lib/models/molstar-viewer";
import { cn } from "@/lib/utils";
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
        isExpanded ? "fixed" : "relative",
        isExpanded ? 0 : "auto",
        isExpanded ? 9999 : "auto",
      )}
    >
      <div className="flex flex-row size-full">
        {showControls && (
          <div className="relative flex-1 max-h-[330px] h-full">
            <MolstarLeftPanelControlsView viewer={viewer} />
          </div>
        )}

        <div className="relative flex flex-col flex-1 size-full">
          <div
            className={cn(
              "relative w-full",
              isExpanded ? "h-[100px]" : "h-[80px]",
            )}
          >
            <MolstarSequence viewer={viewer} />
          </div>
          <div className="relative flex-1">
            <MolstarViewport viewer={viewer} />
          </div>
        </div>

        {showControls && (
          <div className="relative flex-1 max-w-[300px] h-full">
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
