import { InjectionToken, type Signal, inject } from '@angular/core';

/**
 * Per-node context made available to every rendered catalog component via DI.
 *
 * A component injects it to raise events and to read its data-binding scope:
 *
 * ```ts
 * @Component({ selector: 'jr-button', template: `<button (click)="ctx.emit('press')"><ng-content/></button>` })
 * export class JrButton { protected ctx = inject(JR_CONTEXT); }
 * ```
 */
export interface JrContext {
  /** Id of the spec element this component instance renders. */
  readonly nodeId: string;
  /** The current `$item` when inside a `repeat` scope, otherwise `undefined`. */
  readonly item: Signal<unknown>;
  /** The current `$index` when inside a `repeat` scope, otherwise `-1`. */
  readonly index: Signal<number>;
  /** Raise a named event; routed to the element's `on` bindings / action handlers. */
  emit(event: string, payload?: unknown): void;
}

/** Injection token providing the per-node {@link JrContext}. */
export const JR_CONTEXT = new InjectionToken<JrContext>('JR_CONTEXT');

/** Convenience helper to inject the current {@link JrContext} from a component. */
export function injectJrContext(): JrContext {
  return inject(JR_CONTEXT);
}
