import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import './user-selector';
import { http, HttpResponse, delay } from 'msw';
import { Faker, en, base } from "@faker-js/faker";

export default {
  title: 'Form/User/User Selector',
  component: 'ccm-user-selector',
} satisfies Meta;

const formToPre = (form: HTMLFormElement): string => JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);

const userListHandler = http.get('/api/users', async ({ request }) => {
  await delay();
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || '1');
  const pageSize = Number(url.searchParams.get('pageSize') || '10');
  const seed = Number([
    1,
    `${pageSize}`.padStart(3, '0'),
    `${page}`.padStart(10, '0'),
  ].join(''))

  const apiFaker = new Faker({ locale: [en, base], seed });

  return HttpResponse.json(
    Array.from({ length: pageSize }).map((_, index) => {
      const id = (page - 1) * pageSize + index + 1;
      return {
        id,
        avatar: apiFaker.image.avatar(),
        name: apiFaker.internet.username(),
        email: apiFaker.internet.email(),
        dateAdded: new Date().toISOString(),
        status: apiFaker.helpers.arrayElement(['active', 'inactive', 'pending']),
        totalLogins: apiFaker.number.int({ min: 0, max: 100 }),
      };
    }))
});

export const UserSelector: StoryObj = {
  render: () => {
    return html`
      <form class="flex flex-col w-auto gap-2">
        <ccm-user-selector name='user'></ccm-user-selector>
      </form>
      <br>
      <pre>Form Value:<br><code></code></pre>
    `;
  },
  parameters: { msw: { handlers: [userListHandler] } },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('ccm-user-selector')?.showModal();

    const form = canvasElement.querySelector('form');
    if (!form) {
      return;
    }
    const setValue = () => canvasElement.querySelector('pre code')!.textContent = formToPre(form);
    setTimeout(() => setValue());
    form.addEventListener('change', () => setValue());
  }
}

export const WithDefault: StoryObj = {
  render: () => {
    return html`
      <form class="flex flex-col w-auto gap-2">
        <ccm-user-selector name='user' .value=${1}></ccm-user-selector>
      </form>
      <br>
      <pre>Form Value:<br><code></code></pre>
    `;
  },
  parameters: { msw: { handlers: [userListHandler] } },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('ccm-user-selector')?.showModal();

    const form = canvasElement.querySelector('form');
    if (!form) {
      return;
    }
    const setValue = () => canvasElement.querySelector('pre code')!.textContent = formToPre(form);
    setTimeout(() => setValue());
    form.addEventListener('change', () => setValue());
  }
}