import type { Type } from '@angular/core';
import type { Spec, UIElement } from '@json-render/core';

/** Re-export the core spec/element types so consumers depend on one place. */
export type { Spec, UIElement } from '@json-render/core';

/**
 * A registry maps catalog component `type` strings to the Angular component
 * classes that render them. Built with {@link defineRegistry}.
 */
export interface JrRegistry {
  readonly components: Readonly<Record<string, Type<unknown>>>;
}

/**
 * Handler for an action raised by a component's `emit(event, payload)`.
 * Registered via `provideJsonRender({ actions })`.
 */
export type JrActionHandler = (ctx: JrActionContext) => void | Promise<void>;

/** Context passed to a {@link JrActionHandler} when an action fires. */
export interface JrActionContext {
  /** The action name (event name, or the `on` binding's action). */
  readonly action: string;
  /** Payload supplied by the emitting component. */
  readonly payload: unknown;
  /** Id of the spec element that raised the action. */
  readonly nodeId: string;
  /** The element that raised the action. */
  readonly element: UIElement;
}

/** An event surfaced on `JrRenderer`'s `(action)` output. */
export interface JrActionEvent extends JrActionContext {
  readonly spec: Spec;
}
