# @ng-json-render/core

Angular renderer for [json-render](https://json-render.dev) — safely render
AI-agent-generated and server-driven UIs from a JSON spec into **native Angular
components**. No iframes, no `eval`.

Built on the framework-agnostic `@json-render/core` (catalog, spec, streaming,
expression evaluation), this package adds the Angular rendering layer: signals,
standalone components, dynamic instantiation, and DI-based events.

## Install

```sh
npm i @ng-json-render/core @ng-json-render/primitives @json-render/core
```

## Usage

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
    elements: {
      root: { type: 'Stack', props: { gap: 16 }, children: ['title', 'save'] },
      title: { type: 'Text', props: { value: 'Hello', weight: 'bold' } },
      save: { type: 'Button', props: { label: 'Save' }, on: { press: { action: 'save' } } },
    },
  });
  onAction(e) { console.log(e.action, e.nodeId); }
}
```

## Authoring components

A catalog component is a standard standalone component. Props map to discrete
`input()`s, children go through `<ng-content>`, and events are raised via the
injected `JR_CONTEXT`:

```ts
import { Component, inject, input } from '@angular/core';
import { JR_CONTEXT } from '@ng-json-render/core';

@Component({
  selector: 'jr-button',
  template: `<button (click)="ctx.emit('press')">{{ label() }}<ng-content /></button>`,
})
export class MyButton {
  label = input('');
  protected ctx = inject(JR_CONTEXT);
}
```

Register it with `defineRegistry({ Button: MyButton })` and pass to `<jr-renderer>`
or `provideJsonRender({ registry })`.

## Data binding

Props support the full `@json-render/core` expression language — `$state`
paths, `$cond/$then/$else`, `$template`, and directives — resolved against the
spec's `state`. Provide/override state via the `[state]` input.

## Testing

`@ng-json-render/core/testing` exports a `renderSpec()` harness for TestBed:

```ts
import { renderSpec } from '@ng-json-render/core/testing';

const r = renderSpec(spec, { registry });
expect(r.query('button')?.textContent).toContain('Save');
```

## Status

M1 (dynamic renderer + primitives + static/bound specs) is implemented.
Streaming, two-way form binding, and a broader catalog are on the roadmap.
