import { PluginStateSnapshotManager } from "molstar/lib/commonjs/mol-plugin-state/manager/snapshots";
import { PluginUIContext } from "molstar/lib/commonjs/mol-plugin-ui/context";
import {
  DefaultPluginUISpec,
  PluginUISpec,
} from "molstar/lib/commonjs/mol-plugin-ui/spec";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import { BehaviorSubject } from "rxjs";
import { BaseReactiveModel } from "./base-model";

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

    console.log("constructed");

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
  }

  async init() {
    if (this.state.isInitialized.value !== "pending") return;

    console.log("initializing");
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
    // const snapshot = await this.plugin.managers.snapshot.getStateSnapshot()
    return this.plugin.state.getSnapshot({ image: true });
  }

  async setState(snapshot: PluginState.Snapshot) {
    if (this.state.isLoading.value) return;

    this.state.isLoading.next(true);
    await this.plugin.state.setSnapshot(snapshot);
    this.state.isLoading.next(false);
  }
}
