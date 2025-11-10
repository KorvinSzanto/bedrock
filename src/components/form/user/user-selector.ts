import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { theme } from '../../styles/theme';
import { BaseElement } from '../../base-element';
import { Task } from '@lit/task';
import { faRotate as refreshIcon } from '@fortawesome/free-solid-svg-icons';

import "../button";
import "../../dialog/dialog";
import "./user-selector-table.ts";
import "../../icon/icon";
import type { CcmDialog } from '../../dialog/dialog';

type User = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  dateAdded: string;
  status: string;
  totalLogins: number;
}

@customElement('ccm-user-selector')
export class CcmUserSelector extends BaseElement {
  static formAssociated = true;
  static styles = [
    theme,
    // unsafeCSS(userSelectorCss)
  ]

  #internals = this.attachInternals();

  @query('ccm-dialog') _dialogElement!: CcmDialog;
  @property({ type: Number }) value: number | null = null;
  @state() dialogValue = 0;
  @state() page = 1;
  @state() pageSize = 10;

  #userTask = new Task(this, {
    task: async ([page, pageSize]) => {
      const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`);
      return await response.json() as User[];
    },
    args: () => [this.page, this.pageSize],
  });

  connectedCallback(): void {
    super.connectedCallback();
    this.dialogValue = this.value || 0;
    this.#selectUser(false);
  }

  render() {
    const button = html`
      ${this.value && this.value > 0 ? html`
        <ccm-button slot='trigger'>Selected user ID: ${this.value}</ccm-button>
      ` : html`
        <ccm-button slot='trigger' variant='outline' color='success'>Select a user</ccm-button>
      `}
    `;

    const userList = this.#userTask.render({
      pending: () => html`<ccm-user-selector-table skeleton .page=${this.page} .pageSize=${this.pageSize}></ccm-user-selector-table>`,
      complete: (users) => html`
        <ccm-user-selector-table
          .users=${users}
          .selectedUserId=${this.dialogValue}
          .page=${this.page}
          .pageSize=${this.pageSize}
          @select-page=${(e: CustomEvent) => this.page = e.detail}
          @select-user=${(e: CustomEvent) => this.dialogValue = e.detail.id}
        ></ccm-user-selector-table>
      `,
      error: (e) => html`<p>Error loading users: ${e.message}</p>`
    });

    return html`
      <ccm-dialog>
        ${button}
        <span slot='title'>Select User</span>
        <div slot='footer-right' class="flex items-center gap-2">
          <ccm-button variant='outline' title="Refresh" @click=${() => this.#userTask.run()}><ccm-icon .icon=${refreshIcon}></ccm-icon> Refresh</ccm-button>
          <ccm-button slot='footer-right' variant='outline' color='secondary' dismiss>Cancel</ccm-button>
        </div>
        <ccm-button slot='footer-left' color='primary' formmethod='dialog' @click=${() => this.#selectUser()} dismiss>Confirm</ccm-button>
        <div class="w-[calc(100vw_/_2)]">${userList}</div>
      </ccm-dialog>
    `;
  }

  showModal() {
    this.dialogValue = this.value || 0;
    this._dialogElement.showModal();
  }

  #selectUser(withEvent = true) {
    this.value = this.dialogValue;
    this.#internals.setFormValue(this.value ? String(this.value) : null);
    this._dialogElement.close();
    if (withEvent) {
      this._afterUpdateComplete(() => {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  }
}