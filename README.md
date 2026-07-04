# ng-json-render

**Render AI-agent-generated & server-driven UIs from a JSON spec into native Angular components.** No iframes, no `eval`.

📖 **Docs & live demo:** [mainawycliffe.github.io/ng-json-render](https://mainawycliffe.github.io/ng-json-render/)

ng-json-render is the Angular adapter for [json-render](https://json-render.dev) (Vercel Labs). A developer defines a **catalog** of allowed components, an AI (or your server) emits a flat-tree JSON **spec**, and a **registry** maps each component type to a real Angular component that a **renderer** instantiates dynamically — safely and reactively.

It's built on the framework-agnostic [`@json-render/core`](https://www.npmjs.com/package/@json-render/core) (catalog, spec, streaming, expression evaluation) and adds an idiomatic Angular layer: **signals, standalone components, zoneless change detection, dynamic component rendering, DI-based events, and Signal Forms-compatible controls**.

> **Angular compatibility:** `@ng-json-render/core` and `@ng-json-render/primitives` support **Angular 19, 20, 21, and 22** (peer range `>=19.0.0 <23.0.0`). This workspace runs on Angular 21.

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
- **Data binding** — the full `@json-render/core` expression language: `$state`, `$cond/$then/$else`, `$template`, directives, and **`$bindState` two-way binding** to `model()` form controls (structurally **Signal Forms**-compatible on Angular 21).
- **Actions** — components raise events via injected `JR_CONTEXT`; routed to handlers registered through `provideJsonRender({ actions })` and surfaced on the renderer's `(action)` output.
- **Batteries included** — layout (Container, Stack, Grid, Card, Divider), content (Heading, Text, Badge, Stat), feedback (Alert, Progress), data-viz (**BarChart, LineChart, Table** — no chart deps), and forms (Input, Textarea, Select, Checkbox, Switch, Button).
- **Publishable** — both libraries build with ng-packagr (partial compilation), ship correct `exports`/peer deps, and release via `nx release`.

## Custom components

Any standalone Angular component can be a catalog component — there's no base class to extend and no decorator to add. The renderer wires four things into it:

| Concern | How | Notes | 
| --- | --- | --- |
| **Props** | discrete `input()` / `model()` | resolved from the element's `props`, re-applied when bound state changes |
| **Children** | `<ng-content />` | the element's `children` are projected in order |
| **Events** | `inject(JR_CONTEXT).emit(name, payload)` | routed to the element's `on` bindings and action handlers |
| **Two-way state** | `model()` + `$bindState` | any control exposing a `value`/`checked` `model()` binds automatically (Signal Forms-compatible on Angular 21) |

### 1. A display component (props + children)

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'my-callout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="callout" [class]="tone()">
      <strong>{{ title() }}</strong>
      <ng-content />
    </div>
  `,
})
export class MyCallout {
  title = input('');
  tone = input<'info' | 'warn'>('info');
}
```

### 2. An interactive component (events)

Components raise **named events** through `JR_CONTEXT`. The spec routes them to actions via each element's `on` map; handlers are registered with `provideJsonRender({ actions })`, and every action is also surfaced on the renderer's `(action)` output.

```ts
import { Component, inject, input } from '@angular/core';
import { JR_CONTEXT } from '@ng-json-render/core';

@Component({
  selector: 'my-button',
  template: `<button (click)="ctx.emit('press', { at: Date.now() })">{{ label() }}</button>`,
})
export class MyButton {
  label = input('');
  protected ctx = inject(JR_CONTEXT);
}
```

```jsonc
// in a spec: "press" → the "save" action
{ "type": "Button", "props": { "label": "Save" }, "on": { "press": { "action": "save" } } }
```

### 3. A form control (two-way `$bindState`)

Expose the editable value as a `value` `model()` (or `checked` for checkboxes). That's all the renderer needs to two-way bind a `$bindState` prop — no extra wiring. Because the shape matches Angular's Signal Forms `FormValueControl<T>` / `FormCheckboxControl` structurally, the same control also works with the native `[field]` directive on Angular 21.

```ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'my-input',
  template: `<input [value]="value()" (input)="value.set($any($event.target).value)" />`,
})
export class MyInput {
  readonly value = model(''); // structurally a Signal Forms FormValueControl<string>
}
```

> Want the compile-time contract on Angular 21? Add `implements FormValueControl<string>` with `import type { FormValueControl } from '@angular/forms/signals'` — but that pins the component to Angular 21, so the bundled primitives keep it implicit to stay 19+.

```jsonc
{ "type": "Input", "props": { "value": { "$bindState": "/user/email" } } }
```

### 4. Register and provide

```ts
import { defineRegistry, mergeRegistries, provideJsonRender } from '@ng-json-render/core';
import { primitivesRegistry } from '@ng-json-render/primitives';

const myRegistry = defineRegistry({ Callout: MyCallout, Button: MyButton, Input: MyInput });

// Compose with the built-ins (later entries win on conflicts):
const registry = mergeRegistries(primitivesRegistry, myRegistry);

// Provide app-wide (registry + action handlers), or pass [registry] per <jr-renderer>:
provideJsonRender({
  registry,
  actions: {
    save: (ctx) => console.log('save', ctx.payload),
  },
});
```

## Sample integrations

### Static spec

The [Quick start](#quick-start) above — hold a spec in a `signal` and pass it to `<jr-renderer>`.

### Server-driven (fetch a spec)

Your backend (or an agent) returns a spec; render it as data arrives.

```ts
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { JrRenderer, type Spec } from '@ng-json-render/core';
import { primitivesRegistry } from '@ng-json-render/primitives';

@Component({
  selector: 'app-remote-ui',
  imports: [JrRenderer],
  template: `
    @if (ui.value(); as spec) {
      <jr-renderer [spec]="spec" [registry]="registry" (action)="onAction($event)" />
    }
  `,
})
export class RemoteUi {
  registry = primitivesRegistry;
  ui = httpResource<Spec>(() => '/api/generate-ui');
  onAction(e) { /* POST back to your action endpoint */ }
}
```

### Streaming (token-by-token, roadmap)

`@json-render/core` ships a JSONL patch compiler; feed chunks into a `spec` signal so the UI grows as the model streams. A first-class `injectUiStream()` is on the roadmap; the underlying pattern today:

```ts
import { createSpecStreamCompiler, type Spec } from '@ng-json-render/core';

const compiler = createSpecStreamCompiler<Spec>();
const spec = signal<Spec | null>(null);

for await (const chunk of textChunks) {          // e.g. a fetch ReadableStream
  const { result, newPatches } = compiler.push(chunk);
  if (newPatches.length) spec.set({ ...result });
}
```

### AI SDK / agents

Generate the spec against a **catalog** so the model can only emit components you allow (`defineCatalog` / `defineSchema` are re-exported from `@ng-json-render/core`), then render the result. See the [json-render docs](https://json-render.dev/docs) for catalog + AI SDK patterns — the spec format is identical; only the renderer is Angular.

## Component catalog (`@ng-json-render/primitives`)

| Group | `type` | Key props |
| --- | --- | --- |
| Layout | `Container` `Stack` `Grid` `Card` `Divider` | `maxWidth` · `direction/gap/align` · `columns` · `title/subtitle` |
| Content | `Heading` `Text` `Badge` `Stat` | `value/level` · `value/weight/size` · `label/tone` · `label/value/delta` |
| Feedback | `Alert` `Progress` | `title/message/tone` · `value/label` |
| Data-viz | `BarChart` `LineChart` `Table` | `data[{label,value}]` · `data:number[]` · `columns/rows` |
| Forms | `Input` `Textarea` `Select` `Checkbox` `Switch` `Button` | `value`/`checked` via `$bindState`; `Button` emits `press` |

## Testing

Use the `renderSpec()` harness — it mounts a real `<jr-renderer>` and returns DOM query helpers, so every test exercises the actual rendering path.

```ts
import { renderSpec } from '@ng-json-render/core/testing';
import { primitivesRegistry } from '@ng-json-render/primitives';

const r = renderSpec(
  { root: 'b', elements: { b: { type: 'Button', props: { label: 'Save' }, on: { press: { action: 'save' } } } } },
  { registry: primitivesRegistry },
);

expect(r.query('button')?.textContent).toContain('Save');
r.query('button')?.click();
expect(r.actions.map((a) => a.action)).toEqual(['save']);
```

Coverage lives in [`libs/primitives/src/lib/render.spec.ts`](libs/primitives/src/lib/render.spec.ts) (every primitive rendered through the renderer) and [`libs/core/src/lib/jr-renderer.spec.ts`](libs/core/src/lib/jr-renderer.spec.ts) (engine behavior: nesting, binding, actions).

## Development

Everything runs through Nx.

```sh
pnpm install

pnpm exec nx serve demo                 # run the dashboard demo
pnpm exec nx run-many -t lint test build # lint, test, build all projects
pnpm exec nx build core                 # build a publishable package
pnpm exec nx release publish --dry-run  # verify publishing
```

**Stack:** Nx 23 · Angular 19–22 supported (workspace on 21; standalone, zoneless, signals) · pnpm · Vitest · Tailwind v4 · `@json-render/core`.

> Adding a new library mid-session? The Angular Language Server caches `tsconfig` path aliases — run **"TypeScript: Restart TS Server"** in your editor if a new `@ng-json-render/*` import shows as unresolved. (Builds are unaffected.)

## Publishing

Both libraries are publishable Angular packages (ng-packagr, partial compilation) with `publishConfig.access: public`, released via [Nx Release](https://nx.dev/features/manage-releases):

```sh
# Bump versions → changelog → publish (interactive)
pnpm exec nx release

# Or step by step
pnpm exec nx release version 0.1.0
pnpm exec nx release publish --dry-run   # verify first
pnpm exec nx release publish

# Test end-to-end against a local registry (no npm)
pnpm exec nx local-registry              # starts Verdaccio on :4873
```

`@ng-json-render/primitives` depends on `@ng-json-render/core`, so publish core first (or as one release group) and keep versions aligned. Consumers install the `@json-render/core` peer alongside.

## Docs site

The demo doubles as the docs site and deploys to GitHub Pages via [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml) on every push to `main`. It builds the SPA with `--base-href=/ng-json-render/`, adds a `404.html` fallback for client-side routes, and publishes with `actions/deploy-pages`.

**One-time setup:** repo **Settings → Pages → Source: “GitHub Actions.”** The site then lives at [mainawycliffe.github.io/ng-json-render](https://mainawycliffe.github.io/ng-json-render/).

## Status & roadmap

Implemented: the renderer engine, granular reactivity, data binding, actions, two-way Signal Forms binding, a ~19-component Tailwind catalog with charts, and a full dashboard demo.

Planned: streaming (`createSpecStreamCompiler` → signal, `injectUiStream()`) for token-by-token generative UI, `$item/$index` repeat, catalog-driven validators, a broader/shadcn catalog, and AI SDK integration.

## License

[MIT](LICENSE) © Maina Wycliffe
