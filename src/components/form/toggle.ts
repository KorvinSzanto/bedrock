import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import toggleCss from './toggle.css?inline';
import { faDotCircle } from "@fortawesome/free-solid-svg-icons"
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { theme } from '../styles/theme';
import "../icon/icon";
import { BaseElement } from '../base-element';

const defaultAffirmativeTitle = 'Yes';
const defaultNegativeTitle = 'No';

@customElement('ccm-toggle')
export class CcmToggle extends BaseElement {
  static formAssociated = true;
  static styles = [
    theme,
    unsafeCSS(toggleCss)
  ]


  @property({ type: Boolean }) active = false;
  @property({ attribute: false }) value = null;
  @property({ type: String }) affirmativeTitle = defaultAffirmativeTitle;
  @property({ type: String }) negativeTitle = defaultNegativeTitle;

  #internals = this.attachInternals();

  connectedCallback(): void {
    super.connectedCallback();
    if (this.value !== null) {
      this.active = this.value === 'true';
    }

    document.querySelector('form label[for="' + this.id + '"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.active = !this.active;
    });
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (!changedProperties.has('active')) {
      return;
    }

    if (this.active) {
      this.#internals.setFormValue('on', 'on');
      this.#internals.states.add('checked');
      this.#internals.states.add('on');
      this.#internals.states.delete('off');
    } else {
      this.#internals.setFormValue('off', 'null');
      this.#internals.states.delete('checked');
      this.#internals.states.add('off');
      this.#internals.states.delete('on');
    }
    this.updateComplete.then(() => {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event(this.active ? 'activate' : 'deactivate', { bubbles: true, composed: true }))
    });
  }

  render(): unknown {
    if (!this.affirmativeTitle) {
      this.affirmativeTitle = defaultAffirmativeTitle;
    }

    if (!this.negativeTitle) {
      this.negativeTitle = defaultNegativeTitle;
    }
    return html`
      <span class='affirmative' @click=${() => this.active = true}>
        <slot name="affirmative">
          <span class='title' part='title affirmative'>${this.affirmativeTitle}</span>
        </slot>
        ${this.#iconFor(this.active)}
      </span>
      <span class='negative' @click=${() => this.active = false}>
        <slot name="negative">
          <span class='title' part='title negative'>${this.negativeTitle}</span>
        </slot>
        ${this.#iconFor(!this.active)}
      </span>
    `;
  }

  #iconFor(active: boolean): unknown {
    if (active) {
      return html`<ccm-icon .icon=${faDotCircle} part="icon active-icon" exportparts="svg, path"></ccm-icon>`;
    }

    return html`<ccm-icon .icon=${faCircle} part="icon inactive-icon" exportparts="svg, path"></ccm-icon>`;
  }
}