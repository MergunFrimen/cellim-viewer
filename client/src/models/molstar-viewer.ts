import { PluginUIContext } from "molstar/lib/commonjs/mol-plugin-ui/context";
import { BaseReactiveModel } from "./base-model";
import { BehaviorSubject } from "rxjs";
import {
  DefaultPluginUISpec,
  PluginUISpec,
} from "molstar/lib/commonjs/mol-plugin-ui/spec";
import { PluginState } from "molstar/lib/commonjs/mol-plugin/state";
import { PluginStateSnapshotManager } from "molstar/lib/commonjs/mol-plugin-state/manager/snapshots";

export class MolstarViewer extends BaseReactiveModel {
  public plugin: PluginUIContext;

  public state = {
    isInitialized: new BehaviorSubject<boolean>(false),
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
  }

  async init() {
    await this.plugin.init();
    this.state.isInitialized.next(true);
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
