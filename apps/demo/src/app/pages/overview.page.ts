import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsExample } from '../shared/app-docs-example';
import { HELLO_SPEC } from '../examples';

@Component({
  selector: 'app-overview',
  imports: [DocsExample, RouterLink],
  template: `
    <section class="max-w-2xl">
      <h1 class="text-3xl font-semibold tracking-tight">ng-json-render</h1>
      <p class="mt-3 text-lg text-zinc-600 dark:text-zinc-300">
        Render AI-agent-generated & server-driven UIs from a JSON spec into
        native Angular components — no iframes, no <code>eval</code>.
      </p>
      <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        The Angular adapter for
        <a
          href="https://json-render.dev"
          target="_blank"
          rel="noreferrer"
          class="text-indigo-600 hover:underline dark:text-indigo-400"
          >json-render</a
        >. Built on the framework-agnostic <code>&#64;json-render/core</code>,
        with an idiomatic Angular layer: signals, standalone components, zoneless
        change detection, DI events, and Signal Forms.
      </p>
    </section>

    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      @for (c of concepts; track c.term) {
        <div
          class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ c.term }}
          </div>
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{{ c.desc }}</p>
        </div>
      }
    </div>

    <h2 class="mt-10 mb-3 text-lg font-semibold">Try it</h2>
    <p class="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
      This is the spec on the right, rendered live on the left. Edit the name —
      the <code>$bindState</code> input writes straight to state and the
      <code>$template</code> greeting updates instantly.
    </p>
    <app-docs-example [spec]="helloSpec" />

    <div class="mt-10 flex flex-wrap gap-3">
      <a
        routerLink="/components"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >Browse components</a
      >
      <a
        routerLink="/custom"
        class="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >Write your own</a
      >
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly helloSpec = HELLO_SPEC;
  protected readonly concepts = [
    { term: 'Catalog', desc: 'The components an agent is allowed to use, with typed props.' },
    { term: 'Spec', desc: 'A flat JSON tree of typed elements — the model’s output.' },
    { term: 'Registry', desc: 'Maps each spec type to a native Angular component.' },
  ];
}
