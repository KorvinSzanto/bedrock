import { html, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { theme } from '../styles/theme';
import { BaseElement } from '../base-element';
import dialogCss from './dialog.css?inline';
import '../form/button';

@customElement('ccm-dialog')
export class CcmDialog extends BaseElement {
  static styles = [
    theme,
    unsafeCSS(dialogCss)
  ]

  @query('dialog') _dialogElement!: HTMLDialogElement;
  @state() isRendered = false;

  clickListener: (e: Event) => void = (e) => { };

  connectedCallback(): void {
    super.connectedCallback();
    this.clickListener = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('dismiss')) {
        this.close();
      }
    }
    this.addEventListener('click', this.clickListener);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.clickListener);
    super.disconnectedCallback();
  }

  render() {
    return html`
    <slot name='trigger' @click=${this.#triggerClick}></slot>
    ${!this.isRendered ? '' : html`
    <dialog>
      <div class='grow flex flex-col gap-2 h-full min-h-[250px]' part='container'>
        <slot name='head'>
          <div class='py-2 px-4 bg-gray-100' part='header'>
            <slot name='header'>
              <div class='flex justify-between items-center'>
                <div class='text-lg font-semibold'><slot name='title'></slot></div>
                <div>
                  <ccm-button variant='ghost' color='light' class='close' @click=${() => this._dialogElement.close()}>
                    &times;
                  </ccm-button>
                </div>
              </div>
            </slot>
          </div>
        </slot>
        <slot name='body'>
          <div class='grow px-4' part='body'>
            <slot></slot>
          </div>
        </slot>
        <slot name='foot'>
          <div class='bg-gray-100' part='footer'>
            <slot name='footer'>
              <div class='flex justify-between p-4'>
                <slot name='footer-left'></slot>
                <slot name='footer-right'></slot>
              </div>
            </slot>
          </div>
        </slot>
      </div>
    </dialog>
    `}
    `;
  }

  #triggerClick(e: Event) {
    e.preventDefault();
    this.#openWithFade();
  }

  showModal() {
    this.#openWithFade();
  }

  close() {
    this.#closeWithFade();
  }

  #openWithFade() {
    if (!this.isRendered) {
      this.isRendered = true;
    }
    this._afterUpdateComplete(() => {
      const dialog = this._dialogElement;
      dialog.classList.remove('fade-out');
      dialog.classList.add('fade-in');
      dialog.showModal();
      // Remove fade-in after animation
      setTimeout(() => {
        dialog.classList.remove('fade-in');
      }, 300);
    });
  }

  #closeWithFade() {
    const dialog = this._dialogElement;
    dialog.classList.remove('fade-in');
    dialog.classList.add('fade-out');
    setTimeout(() => {
      dialog.classList.remove('fade-out');
      dialog.close();
    }, 300);
  }
}