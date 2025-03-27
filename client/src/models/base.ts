import { Observable, Subscription } from "rxjs";

export abstract class BaseReactiveModel {
  private subscriptions: Subscription[] = [];

  subscribe<T>(observable: Observable<T>, sub: (v: T) => void) {
    this.subscriptions.push(observable.subscribe(sub));
  }

  dispose() {
    for (const sub of this.subscriptions) sub.unsubscribe();
    this.subscriptions = [];
  }

  mount() {
    // override in child classes
  }
}