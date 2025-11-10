import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import './switch';
import { fn } from 'storybook/test';
import type { CcmSwitch } from './switch';
import { eol } from '../../tools';

const formToPre = (form: HTMLFormElement): string => {
  const formData = new FormData(form);
  const entries = Array.from(formData.entries()).map(([key, value]) => `${key}: ${value}`);
  return JSON.stringify(Object.fromEntries(formData), null, 2);
};

export default {
  title: 'Form/Switch',
  component: 'ccm-switch',
} satisfies Meta;

export const Switch: StoryObj = {
  render: (args) => {
    console.log(args.active);
    const affirmative = args.affirmativeTitle ? args.affirmativeTitle : null;
    const negative = args.negativeTitle ? args.negativeTitle : null;
    return html`
      <form>
        <label for="toggleField">Switch Label</label>
        <br>
        <ccm-switch
          id="toggleField"
          name="toggleField"
          affirmativeTitle=${affirmative}
          negativeTitle=${negative}
          ?active=${args.active}
          @change=${(e: Event) => args.onChange((e.target as CcmSwitch).active)}
          @activate=${(e: Event) => args.onActivate()}
          @deactivate=${(e: Event) => args.onDeactivate()}
          ></ccm-switch>
      </form>
      <br>
      <pre>Form Value:<br><code></code></pre>
    `;
  },
  args: {
    active: false,
    onChange: fn(),
    onActivate: fn(),
    onDeactivate: fn(),
    affirmativeTitle: null,
    negativeTitle: null,
  },
  argTypes: {
    affirmativeTitle: { control: 'text' },
    negativeTitle: { control: 'text' },
  },
  play: async ({ args, canvasElement }) => {
    const form = canvasElement.querySelector('form');
    if (!form) {
      return;
    }
    const setValue = () => canvasElement.querySelector('pre code')!.textContent = formToPre(form);
    setTimeout(() => setValue());
    form.addEventListener('change', () => setValue());

    canvasElement.querySelectorAll('ccm-switch').forEach((switchElement) => {
      switchElement.addEventListener('change', () => {
        args.active = (switchElement as CcmSwitch).active;
      });
    });
  }
};

export const SwitchStyled: StoryObj = {
  render: (args) => html`
      Style with CSS:
      <br>
      <ccm-switch ?active=${args.active}></ccm-switch>
      <style>
        ${args.css}
      </style>
      `,
  args: {
    active: true,
    css: eol`
      ccm-switch {
        --bubble-padding: 0.5rem;
        --width: 4rem;

        --background-color: coral;
        --bubble-background-color: red;
        --bubble-outline-color: darkred;
        --outline-color: darkred;

        --active-background-color: lightblue;
        --active-bubble-background-color: blue;
        --active-bubble-outline-color: darkblue;
        --active-outline-color: darkblue;
        --bubble-width: 0.25rem;
        --bubble-easing: ease-in-out;
        --bubble-duration: 0.3s;
      }

      ccm-switch::part(track) {
        border-radius: 0px;
      }
      
      ccm-switch::part(track):before {
        content: 'OFF';
        position: absolute;
        line-height: 1rem;
        width: 3rem;
        text-align: center;
        transition: opacity 0.3s ease-in-out;
      }
      
      ccm-switch::part(track):after {
        transition: opacity 0.3s ease-in-out;
        content: 'ON';
        position: absolute;
        line-height: 1rem;
        width: 3rem;
        text-align: center;
      }
      
      ccm-switch:state(on)::part(track):after {
        opacity: 0;
      }
      ccm-switch:state(off)::part(track):before {
        opacity: 0;
      }
    `
  }
}