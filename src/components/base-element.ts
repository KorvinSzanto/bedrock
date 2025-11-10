import { LitElement } from "lit";

export class BaseElement extends LitElement {
  _toggleState(internals: ElementInternals, state: any, shouldBe?: boolean) {
    let add = shouldBe === undefined ? internals.states.has(state) : shouldBe;
    internals.states[add ? 'add' : 'delete'](state);
  }

  _afterUpdateComplete(callback: (bool: boolean) => void) {
    this.updateComplete.then(callback);
  }
}