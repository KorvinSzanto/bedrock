import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ccm-icon')
export class CcmIcon extends LitElement {

  static styles = [
    css`
      :host {
        display: inline-block;
        width: 1em;
        height: 1em;
        vertical-align: middle;
        fill: currentColor;
        stroke: red;
        position: relative;
      }
      svg {
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
    `,
  ]

  @property({ type: Object }) icon: IconDefinition | null = null;

  render(): unknown {
    if (this.icon === null) {
      return html``;
    }

    const [width, height, , , svgPathData] = this.icon.icon;

    return html`
      <svg viewBox="0 0 ${width} ${height}" part="svg">
        <path d="${svgPathData}" part="path"></path>
      </svg>
    `;
  }
}