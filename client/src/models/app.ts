import { BaseReactiveModel } from "./base";
import { MolstarViewer } from "./molstar-viewer";

export class App extends BaseReactiveModel {
  molstarViewer: MolstarViewer;

  constructor() {
    super();

    this.molstarViewer = new MolstarViewer();
  }

  mount() {
    //
  }

  dispose() {
    super.dispose();
  }
}
