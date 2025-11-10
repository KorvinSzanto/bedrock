import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import './password';
import type { CcmPassword } from './password';

const formToPre = (form: HTMLFormElement): string => JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);

export default {
  title: 'Form/Password',
  component: 'ccm-password',
} satisfies Meta;

export const Toggle: StoryObj = {
  render: (args) => {
    return html`
      <form class="flex flex-col [&_label]:mt-2">
        <label for="passwordField">Editable</label>
        <ccm-password name="passwordField" id="passwordField"></ccm-password>
        <label for="validDisabled">Valid but disabled</label>
        <ccm-password name="validDisabled" id="validDisabled" value='urM47\TW,kVR8cg;vv1p$' disabled></ccm-password>
        <label for="validReadonly">Valid but readonly</label>
        <ccm-password name="validReadonly" id="validReadonly" value='urM47\TW,kVR8cg;vv1p$' readonly></ccm-password>
        <label for="invalidDisabled">Invalid but disabled</label>
        <ccm-password name="invalidDisabled" id="invalidDisabled" value='urM' disabled></ccm-password>
        <label for="invalidReadonly">Invalid but readonly</label>
        <ccm-password name="invalidReadonly" id="invalidReadonly" value='urM' readonly></ccm-password>
        <label for="withoutToggler">Without toggler</label>
        <ccm-password name="withoutToggler" id="withoutToggler" value='urM' hideToggler></ccm-password>
        <label for="withoutStrengthMeter">Without strength meter</label>
        <ccm-password name="withoutStrengthMeter" id="withoutStrengthMeter" value='urM' hideStrengthMeter></ccm-password>
        <label for="withNothing">With nothing</label>
        <ccm-password name="withNothing" id="withNothing" value='urM' hideStrengthMeter hideToggler></ccm-password>
      </form>
      <br>
      <pre>Form Value:<br><code></code></pre>
    `;
  },
  play: async ({ args, canvasElement }) => {
    const form = canvasElement.querySelector('form');
    if (!form) {
      return;
    }
    const setValue = () => canvasElement.querySelector('pre code')!.textContent = formToPre(form);
    setTimeout(() => setValue());
    form.addEventListener('change', () => setValue());

    canvasElement.querySelectorAll('ccm-password').forEach((element) => {
      element.addEventListener('change', () => {
        args.active = (element as CcmPassword).value;
      });
    });
  }
}