import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import './toggle';
import { fn } from 'storybook/test';
import type { CcmToggle } from './toggle';

const formToPre = (form: HTMLFormElement): string => {
  const formData = new FormData(form);
  const entries = Array.from(formData.entries()).map(([key, value]) => `${key}: ${value}`);
  return JSON.stringify(Object.fromEntries(formData), null, 2);
};

export default {
  title: 'Form/Toggle',
  component: 'ccm-toggle',
} satisfies Meta;

export const Toggle: StoryObj = {
  render: (args) => {
    const affirmative = args.affirmativeTitle ? args.affirmativeTitle : null;
    const negative = args.negativeTitle ? args.negativeTitle : null;
    return html`
      <form>
        <ccm-toggle
          name="toggleField"
          affirmativeTitle=${affirmative}
          negativeTitle=${negative}
          ?active=${args.active}
          @change=${(e: Event) => args.onChange((e.target as CcmToggle).active)}
          @activate=${(e: Event) => args.onActivate()}
          @deactivate=${(e: Event) => args.onDeactivate()}
          ></ccm-toggle>
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
  }
};
