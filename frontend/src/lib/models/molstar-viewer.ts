// import { LoadVolseg } from "molstar/lib/commonjs/extensions/volumes-and-segmentations";
import { PluginStateSnapshotManager } from "molstar/lib/commonjs/mol-plugin-state/manager/snapshots";
import { PluginUIContext } from "molstar/lib/commonjs/mol-plugin-ui/context";
import {
  DefaultPluginUISpec,
  PluginUISpec,
} from "molstar/lib/commonjs/mol-plugin-ui/spec";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import { BehaviorSubject, combineLatest } from "rxjs";
import { BaseReactiveModel } from "./base-model";
import { LoadVolseg } from "@/volseg/src/extensions/volumes-and-segmentations";

type InitializationState = "pending" | "initializing" | "success" | "error";

export class MolstarViewerModel extends BaseReactiveModel {
  public plugin: PluginUIContext;

  public state = {
    isInitialized: new BehaviorSubject<InitializationState>("pending"),
    isLoading: new BehaviorSubject<boolean>(false),
    showControls: new BehaviorSubject<boolean>(false),
    isExpanded: new BehaviorSubject<boolean>(false),
  };

  constructor() {
    super();

    const defaultSpec = DefaultPluginUISpec();
    const spec: PluginUISpec = {
      ...defaultSpec,
      layout: {
        initial: {
          isExpanded: this.state.isExpanded.value,
          showControls: this.state.showControls.value,
        },
      },
    };

    this.plugin = new PluginUIContext(spec);
  }

  mount() {
    // sync UI layout controls
    this.subscribe(this.plugin.layout.events.updated, () => {
      this.state.showControls.next(this.plugin.layout.state.showControls);
      this.state.isExpanded.next(this.plugin.layout.state.isExpanded);
    });
    this.subscribe(this.plugin.events.log, (message) => {
      // console.log(message);
    });
    // this.subscribe(
    //   combineLatest([
    //     this.plugin.behaviors.state.isUpdating,
    //     this.plugin.behaviors.state.isAnimating,
    //     // this.plugin.behaviors.state.isBusy,
    //   ]),
    //   (states) => {
    //     console.log("isLoading?", states);
    //     this.state.isLoading.next(states.some((x) => x == true));
    //   },
    // );
  }

  async init() {
    if (this.state.isInitialized.value !== "pending") return;

    this.state.isInitialized.next("initializing");
    try {
      await this.plugin.init();
    } catch (err) {
      console.error("Failed to copy text: ", err);
      this.state.isInitialized.next("error");
    }
    this.state.isInitialized.next("success");
  }

  async clear(): Promise<void> {
    await this.plugin.clear();
  }

  async screenshot(): Promise<string> {
    // generate new screenshot of render
    const screenshot = await PluginStateSnapshotManager.getCanvasImageAsset(
      this.plugin,
      "screenshot.png",
    );
    if (!screenshot) throw new Error("no image");
    const file = this.plugin.managers.asset.get(screenshot)?.file;
    if (!file) throw new Error("no file");
    return URL.createObjectURL(file);
  }

  async thumbnailImage(): Promise<File> {
    // generate new screenshot of render
    const screenshot = await PluginStateSnapshotManager.getCanvasImageAsset(
      this.plugin,
      "screenshot.png",
    );
    if (!screenshot) throw new Error("no image");
    const file = this.plugin.managers.asset.get(screenshot)?.file;
    if (!file) throw new Error("no file");
    return file;
  }

  getState(): PluginState.Snapshot {
    return this.plugin.state.getSnapshot({ image: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async loadSnapshot(snapshot: any) {
    if (this.state.isLoading.value) return;

    this.state.isLoading.next(true);

    try {
      await this.plugin.state.setSnapshot(snapshot);
    } catch (error) {
      console.error("Error loading snapshot:", error);
      throw error;
    } finally {
      this.state.isLoading.next(false);
    }
  }

  async loadVolseg(entryId: string) {
    if (this.state.isLoading.value) return;

    this.state.isLoading.next(true);

    this.plugin.runTask(
      this.plugin.state.data.applyAction(LoadVolseg, {
        serverUrl: `${import.meta.env.VITE_VOLSEG_API_URL}/v1`,
        source: {
          name: "emdb",
          params: {
            entryId: entryId,
          },
        },
      }),
    );

    this.state.isLoading.next(false);
  }
}
