import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { theme } from '../styles/theme';
import { BaseElement } from '../base-element';
import buttonCss from './button.css?inline';

@customElement('ccm-button')
export class CcmButton extends BaseElement {

  static formAssociated = true;
  static styles = [
    theme,
    unsafeCSS(buttonCss)
  ]

  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ reflect: true }) variant?: 'outline' | 'ghost';
  @property({ reflect: true }) color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  @property({ reflect: true }) size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  render() {
    return html`
    <button ?disabled=${this.disabled} part='button'>
      <slot name='start'></slot>
      <slot></slot>
      <slot name='end'></slot>
    </button>
    `;
  }
}