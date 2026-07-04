import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  type JrActionEvent,
  type JrActionHandler,
  type JrRegistry,
  JrRenderer,
  type Spec,
  provideJsonRender,
} from '@ng-json-render/core';

/** Options for {@link renderSpec}. */
export interface RenderSpecOptions {
  /** Registry mapping component types to Angular classes. */
  registry: JrRegistry;
  /** Optional action handlers, provided via `provideJsonRender`. */
  actions?: Record<string, JrActionHandler>;
  /** Optional initial state. */
  state?: Record<string, unknown>;
}

/** Handle returned by {@link renderSpec}. */
export interface RenderSpecResult {
  readonly fixture: ComponentFixture<JrRenderer>;
  /** Root DOM element of the mounted renderer. */
  readonly host: HTMLElement;
  /** Actions captured from the renderer's `(action)` output, in order. */
  readonly actions: readonly JrActionEvent[];
  /** Replace the spec and run change detection. */
  setSpec(next: Spec): void;
  /** Query the rendered DOM. */
  query(selector: string): HTMLElement | null;
  queryAll(selector: string): HTMLElement[];
}

/**
 * Mount a {@link Spec} in a TestBed and return helpers for asserting the output.
 *
 * ```ts
 * const r = renderSpec(spec, { registry });
 * expect(r.query('button')?.textContent).toContain('Save');
 * ```
 */
export function renderSpec(
  spec: Spec,
  options: RenderSpecOptions,
): RenderSpecResult {
  TestBed.configureTestingModule({
    providers: options.actions
      ? [provideJsonRender({ actions: options.actions })]
      : [],
  });

  const fixture = TestBed.createComponent(JrRenderer);
  const actions: JrActionEvent[] = [];
  fixture.componentInstance.action.subscribe((e) => actions.push(e));

  fixture.componentRef.setInput('registry', options.registry);
  if (options.state) fixture.componentRef.setInput('state', options.state);
  fixture.componentRef.setInput('spec', spec);
  fixture.detectChanges();

  const host = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    host,
    actions,
    setSpec(next: Spec) {
      fixture.componentRef.setInput('spec', next);
      fixture.detectChanges();
    },
    query: (selector) => host.querySelector<HTMLElement>(selector),
    queryAll: (selector) =>
      Array.from(host.querySelectorAll<HTMLElement>(selector)),
  };
}
