import { BaseReactiveModel } from "./base-model";
import { MolstarViewerModel } from "./molstar-viewer";
import { ThemeManager } from "./theme-manager";

export class MainModel extends BaseReactiveModel {
  public molstarViewer: MolstarViewerModel;
  public themeManager: ThemeManager;

  constructor() {
    super();

    this.molstarViewer = new MolstarViewerModel();
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
