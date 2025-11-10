import { html, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { theme } from '../styles/theme';
import passwordCss from './password.css?inline';
import "../icon/icon";
import { passwordStrength, type Result } from 'check-password-strength'
import { BaseElement } from '../base-element';

const strings = {
  invalid: 'Invalid',
  tooWeak: 'Too Weak',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  veryStrong: 'Very Strong'
};
const passwordStrengthOptions = [
  { id: -1, value: strings.invalid, minDiversity: 0, minLength: 0 },
  { id: 0, value: strings.tooWeak, minDiversity: 1, minLength: 5 },
  { id: 1, value: strings.weak, minDiversity: 2, minLength: 6 },
  { id: 2, value: strings.medium, minDiversity: 4, minLength: 8 },
  { id: 3, value: strings.strong, minDiversity: 4, minLength: 12 },
  { id: 4, value: strings.veryStrong, minDiversity: 4, minLength: 16 }
] satisfies Parameters<typeof passwordStrength>[1];

const bars = passwordStrengthOptions.filter(({ id }) => id >= 0);

@customElement('ccm-password')
export class CcmPassword extends BaseElement {

  static formAssociated = true;
  static styles = [
    theme,
    unsafeCSS(passwordCss)
  ]

  #internals = this.attachInternals();
  #inputRef = createRef<HTMLInputElement>();

  @state() passwordVisible: boolean = false;
  @state() strength: Result<string> | null = null;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) readonly: boolean = false;
  @property({ type: Boolean }) hideStrengthMeter: boolean = false;
  @property({ type: Boolean }) hideToggler: boolean = false;
  @property({ type: String }) value: string = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.strength = passwordStrength(this.value, passwordStrengthOptions);
    this.#updateValidity();

    document.querySelector('form label[for="' + this.id + '"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.#inputRef.value?.focus();
    });
  }

  render() {
    return html`
      <div part="container">
        <input
          part="input"
          autocomplete="off"
          value="${this.value}"
          type="${this.passwordVisible ? 'text' : 'password'}"
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @input=${(e: Event) => this.value = (e.target as HTMLInputElement).value}
          ${ref(this.#inputRef)}
        />
        ${(!this.hideToggler) ? html`<button
          part="toggler"
          type="button"
          class="input-group-icon"
          @click=${() => this.passwordVisible = !this.passwordVisible}
        >
          <ccm-icon part="icon" exportparts="svg=icon-svg, path=icon-path" aria-hidden="true" class="fas" .icon=${this.passwordVisible ? faEye : faEyeSlash}></ccm-icon>
        </button>` : ''}
      </div>

      ${(!this.hideStrengthMeter) ? this.renderStrengthMeter(this.strength) : ''}
    `;
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('value')) {
      this.strength = passwordStrength(this.value, passwordStrengthOptions);
    }
  }

  updated(changed: PropertyValues) {
    if (changed.has('value')) {
      this.#internals.setFormValue(this.value);

      this.#updateValidity();
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  renderStrengthMeter(strength: Result<string> | null) {
    const id = strength ? strength.id : -1;

    return html`
      <ul part="strength-meter">
        ${bars.map(bar => html`
          <li part="bar ${id >= bar.id ? 'active-bar' : ''}" title=${bar.value}></li>
        `)}
      </ul>
    `;
  }

  #updateValidity() {
    const valid = (this.strength?.id ?? -1) >= 0;
    let lowest = passwordStrengthOptions.filter((option) => option.id >= (this.strength?.id ?? -1)).shift()?.value ?? '';
    this.#internals.setValidity({ badInput: !valid }, lowest);
  }
}