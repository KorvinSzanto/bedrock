import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { theme } from '../styles/theme';
import { CcmToggle } from './toggle';
import switchCss from './switch.css?inline';

@customElement('ccm-switch')
export class CcmSwitch extends CcmToggle {
  static styles = [
    theme,
    unsafeCSS(switchCss),
  ]

  render() {
    return html`
      <div class='rounded-full' @click=${() => this.active = !this.active} part="track">
        <div class='bg-black rounded-full absolute' ?on=${this.active} part="bubble"></div>
      </div>
    `;
  }
}