import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { theme } from '../../styles/theme';
import { BaseElement } from '../../base-element';
import userSelectorTableCss from './user-selector-table.css?inline';
import "../button";

export type User = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  dateAdded: string;
  status: string;
  totalLogins: number;
}

@customElement('ccm-user-selector-table')
export class CcmUserSelectorTable extends BaseElement {
  static styles = [
    theme,
    unsafeCSS(userSelectorTableCss)
  ]

  @property({ type: Boolean }) skeleton: boolean = false;
  @property({ type: Array }) users: User[] = [];
  @property({ type: Number }) selectedUserId: number | null = null;
  @property({ type: Number }) page: number = 1;
  @property({ type: Number }) pageSize: number = 10;

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date Added</th>
            <th>Status</th>
            <th>Total Logins</th>
          </tr>
          <tbody>
            ${this.skeleton
        ? new Array(this.pageSize).fill(0).map(() => html`
          <tr class="skeleton">
            <td class="avatar"><div>&nbsp;</div></td>
            <td class="id"><span>&nbsp;</span></td>
            <td class="name"><span>&nbsp;</span></td>
            <td class="email"><span>&nbsp;</span></td>
            <td class="date-added"><span>&nbsp;</span></td>
            <td class="status"><span>&nbsp;</span></td>
            <td class="total-logins"><span>&nbsp;</span></td>
          </tr>
          `)
        : this.users.map(user => html`
              <tr class="${this.selectedUserId === user.id ? 'active' : ''}" @click=${() => this.#selectUser(user)}>
                <td class="avatar"><img src="${user.avatar}" alt="${user.name}" /></td>
                <td class="id"><span>${user.id}</span></td>
                <td class="name"><span>${user.name}</span></td>
                <td class="email"><span>${user.email}</span></td>
                <td class="date-added"><span>${user.dateAdded}</span></td>
                <td class="status"><span>${user.status}</span></td>
                <td class="total-logins"><span>${user.totalLogins}</span></td>
              </tr>
            `)}
          </tbody>
      </table>
      <div class="pagination">
        <ccm-button @click=${() => this.#changePage(this.page - 1)} ?disabled=${this.page === 1}>Previous</ccm-button>
        <span>Page ${this.page}</span>
        <ccm-button @click=${() => this.#changePage(this.page + 1)} ?disabled=${this.users.length < this.pageSize}>Next</ccm-button>
      </div>
    `;
  }

  #selectUser(user: User) {
    this.dispatchEvent(new CustomEvent('select-user', {
      detail: user
    }));
  }

  #changePage(newPage: number) {
    this.dispatchEvent(new CustomEvent('select-page', {
      detail: newPage
    }));
  }
}