import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import './dialog';
import '../form/button'

export default {
  title: 'Dialog',
  component: 'ccm-dialog',
} satisfies Meta;

export const Default: StoryObj = {
  render: () => {
    return html`
      <form class="flex flex-col w-auto gap-2">
        <ccm-dialog>
          <ccm-button slot="trigger" color="primary">Open Dialog</ccm-button>
          <span slot="title">Example Dialog</span>

          <div>
            <p>This is the content of the dialog. You can put any information you want here.</p>
            <p>Dialogs are useful for displaying important information or getting user input without navigating away from the current page.</p>
          </div>

          <ccm-button slot=footer-right variant="outline" color="secondary" dismiss>Example Close</ccm-button>
          <ccm-button slot=footer-left color="primary" formmethod="dialog" dismiss>Example Okay</ccm-button>
        </ccm-dialog>
      </form>
    `;
  },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('ccm-dialog').showModal();
  }
}