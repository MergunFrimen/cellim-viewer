import { BehaviorSubject, distinctUntilChanged } from "rxjs";
import { BaseReactiveModel } from "./base-model";

export type Theme = "dark" | "light";

export class ThemeManager extends BaseReactiveModel {
  private readonly _storageKey = "vite-ui-theme";
  private readonly _defaultTheme: Theme = "light";

  readonly state = {
    theme: new BehaviorSubject<Theme>(this._initTheme()),
  };

  readonly commands = {
    toggleTheme: () => this._toggleTheme(),
  };

  constructor() {
    super();
  }

  mount() {
    this.subscribe(this.state.theme.pipe(distinctUntilChanged()), (theme) =>
      this._setTheme(theme),
    );
  }

  private _initTheme() {
    const theme = localStorage.getItem(this._storageKey);
    if (theme === "dark" || theme === "light") return theme;
    return this._defaultTheme;
  }

  private _toggleTheme() {
    if (this.state.theme.value === "dark") this._setTheme("light");
    else this._setTheme("dark");
  }

  private _setTheme(theme: Theme) {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(this._storageKey, theme);
    this.state.theme.next(theme);
  }
}
