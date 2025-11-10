import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import * as regular from '@fortawesome/free-regular-svg-icons';
import * as solid from '@fortawesome/free-solid-svg-icons';
import './icon';

const meta: Meta = {
  title: 'Icon/Icon',
  component: 'ccm-icon',
};
export default meta;

type Story = StoryObj;

const icons = {
  ...Object.fromEntries(Object.entries(regular).map(([key, value]) => [`regular.${key}`, value])),
  ...Object.fromEntries(Object.entries(solid).map(([key, value]) => [`solid.${key}`, value])),
};

const options: Partial<Story> = {
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: Object.keys(icons),
      mapping: icons
    },
  },
  args: {
    icon: 'solid.faThumbsUp',
  }
}

export const Icon: Story = {
  render: (args) => html`
    <div>
      <p>Rather than using classes or strings, pass the icon object directly:</p>
      <ccm-icon .icon=${args.icon}></ccm-icon>
    </div>
    <div>
      <p>Use font size and text color to control the icon size:</p>
      <ccm-icon .icon=${args.icon} style="font-size: 2rem; color: blue;"></ccm-icon>
    </div>

    <div>
      <p>Use the ::part selector with <code>::part(svg)</code> or <code>::part(path)</code> to style the svg or path directly:</p>
      <ccm-icon class='part-example' .icon=${args.icon}></ccm-icon>
      <style>
        .part-example::part(svg) {
          width: 3rem;
          height: 3rem;
        }
        .part-example::part(path) {
          stroke: red;
          stroke-width: 10;
          fill: yellow;
          transform: scale(0.5);
        }
      </style>
    </div>
  `,
  ...options,
};
