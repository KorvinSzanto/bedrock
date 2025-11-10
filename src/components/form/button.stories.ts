import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import './button';

const formToPre = (form: HTMLFormElement): string => JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);

export default {
  title: 'Form/Button',
  component: 'ccm-button',
} satisfies Meta;

const variants = ['', 'outline', 'ghost'] as const;
const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const Button: StoryObj = {
  render: () => {
    return html`
      <form class="flex flex-col w-auto gap-2">
        <div class='flex gap-2'>
          ${sizes.map(size => html`<div><ccm-button size="${size}">${size} button</ccm-button></div>`)}
        </div>
        ${variants.map(variant => html`
          ${variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : "Default"} Variant:
          <div class="flex gap-2">${colors.map(color => html`<ccm-button color="${color}" variant="${variant}">${color.charAt(0).toUpperCase() + color.slice(1)}</ccm-button>`)}</div>
        `)}

        <div class="flex flex-col gap-2">
          Before and after slots:
          <div class="flex gap-2">
            <div>
              <ccm-button color="primary">
                <span slot="start">🚀</span>
                Button Text
              </ccm-button>
            </div>
            <div>
              <ccm-button color="primary">
                Button Text
                <span slot="end">🚀</span>
              </ccm-button>
            </div>
            <div>
              <ccm-button color="primary">
                <span slot="start">🚀</span>
                Button Text
                <span slot="end">🚀</span>
              </ccm-button>
            </div>
          </div>
        </div>
      </form>
    `;
  }
}