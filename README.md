# ng-json-render

**Render AI-agent-generated & server-driven UIs from a JSON spec into native Angular components.** No iframes, no `eval`.

ng-json-render is the Angular adapter for [json-render](https://json-render.dev) (Vercel Labs). A developer defines a **catalog** of allowed components, an AI (or your server) emits a flat-tree JSON **spec**, and a **registry** maps each component type to a real Angular component that a **renderer** instantiates dynamically — safely and reactively.

It's built on the framework-agnostic [`@json-render/core`](https://www.npmjs.com/package/@json-render/core) (catalog, spec, streaming, expression evaluation) and adds an idiomatic Angular layer: **signals, standalone components, zoneless change detection, dynamic component rendering, DI-based events, and Angular 21 Signal Forms**.

```text
┌─────────────┐   JSON spec    ┌──────────────┐   registry    ┌────────────────────┐
│  AI / server │ ────────────▶ │  <jr-renderer>│ ───────────▶ │ native Angular DOM │
└─────────────┘  {root,elements} └──────────────┘  type→class  └────────────────────┘
```

## Packages

| Package | Description |
| --- | --- |
| [`@ng-json-render/core`](libs/core) | The rendering engine: `JrRenderer`, `defineRegistry`, `provideJsonRender`, `JR_CONTEXT`, state store, `$bindState` two-way binding. Publishable. |
| [`@ng-json-render/core/testing`](libs/core/testing) | A `renderSpec()` TestBed harness (secondary entry point). |
| [`@ng-json-render/primitives`](libs/primitives) | ~19 Tailwind-styled components: layout, content, feedback, **charts/table**, and **Signal Forms** controls. Publishable. |
| [`apps/demo`](apps/demo) | An analytics dashboard rendered entirely from one spec. |

## Quick start

```ts
import { Component, signal } from '@angular/core';
import { JrRenderer, type Spec } from '@ng-json-render/core';
import { primitivesRegistry } from '@ng-json-render/primitives';

@Component({
  selector: 'app-root',
  imports: [JrRenderer],
  template: `<jr-renderer [spec]="spec()" [registry]="registry" (action)="onAction($event)" />`,
})
export class App {
  registry = primitivesRegistry;
  spec = signal<Spec>({
    root: 'root',
    state: { name: 'Ada' },
    elements: {
      root: { type: 'Stack', props: { gap: 16 }, children: ['title', 'field', 'save'] },
      title: { type: 'Heading', props: { value: 'Hello', level: 1 } },
      field: { type: 'Input', props: { label: 'Name', value: { $bindState: '/name' } } },
      save:  { type: 'Button', props: { label: 'Save' }, on: { press: { action: 'save' } } },
    },
  });
  onAction(e) { console.log(e.action, e.nodeId); }
}
```

## Features

- **Dynamic rendering** — a flat spec tree is instantiated with `ViewContainerRef.createComponent()`; children project into each component's `<ng-content>`.
- **Granular reactivity** — structural changes rebuild the tree; state changes update individual nodes' inputs in place (no rebuild, no focus loss).
- **Data binding** — the full `@json-render/core` expression language: `$state`, `$cond/$then/$else`, `$template`, directives, and **`$bindState` two-way binding** wired to Angular 21 **Signal Forms** `model()` controls.
- **Actions** — components raise events via injected `JR_CONTEXT`; routed to handlers registered through `provideJsonRender({ actions })` and surfaced on the renderer's `(action)` output.
- **Batteries included** — layout (Container, Stack, Grid, Card, Divider), content (Heading, Text, Badge, Stat), feedback (Alert, Progress), data-viz (**BarChart, LineChart, Table** — no chart deps), and forms (Input, Textarea, Select, Checkbox, Switch, Button).
- **Publishable** — both libraries build with ng-packagr (partial compilation), ship correct `exports`/peer deps, and release via `nx release`.

## Authoring your own components

A catalog component is a standard standalone component. Props map to discrete `input()`s, children go through `<ng-content>`, and events use the injected `JR_CONTEXT`:

```ts
import { Component, inject, input } from '@angular/core';
import { JR_CONTEXT } from '@ng-json-render/core';

@Component({
  selector: 'my-button',
  template: `<button (click)="ctx.emit('press')">{{ label() }}<ng-content /></button>`,
})
export class MyButton {
  label = input('');
  protected ctx = inject(JR_CONTEXT);
}
```

Register it: `defineRegistry({ Button: MyButton })`. Form controls that implement Signal Forms' `FormValueControl<T>` / `FormCheckboxControl` get two-way `$bindState` support automatically.

## Development

Everything runs through Nx.

```sh
pnpm install

pnpm exec nx serve demo                 # run the dashboard demo
pnpm exec nx run-many -t lint test build # lint, test, build all projects
pnpm exec nx build core                 # build a publishable package
pnpm exec nx release publish --dry-run  # verify publishing
```

**Stack:** Nx 23 · Angular 21 (standalone, zoneless, signals) · pnpm · Vitest · Tailwind v4 · `@json-render/core`.

> Adding a new library mid-session? The Angular Language Server caches `tsconfig` path aliases — run **"TypeScript: Restart TS Server"** in your editor if a new `@ng-json-render/*` import shows as unresolved. (Builds are unaffected.)

## Status & roadmap

Implemented: the renderer engine, granular reactivity, data binding, actions, two-way Signal Forms binding, a ~19-component Tailwind catalog with charts, and a full dashboard demo.

Planned: streaming (`createSpecStreamCompiler` → signal, `injectUiStream()`) for token-by-token generative UI, `$item/$index` repeat, catalog-driven validators, a broader/shadcn catalog, and AI SDK integration.

## License

MIT
