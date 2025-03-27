import { BaseReactiveModel } from "./base-model";
import { MolstarViewer } from "./molstar-viewer";
import { ThemeManager } from "./theme-manager";

export class MainModel extends BaseReactiveModel {
  public molstarViewer: MolstarViewer;
  public themeManager: ThemeManager;

  constructor() {
    super();

    this.molstarViewer = new MolstarViewer();
    this.themeManager = new ThemeManager();
  }

  mount() {
    this.themeManager.mount();
  }

  dispose() {
    super.dispose();
    this.themeManager.dispose();
  }
}
