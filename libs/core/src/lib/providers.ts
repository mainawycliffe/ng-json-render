import {
  type EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { JR_REGISTRY } from './registry';
import type { JrActionContext, JrActionHandler, JrRegistry } from './types';

/** A dispatcher routes emitted actions to their handlers. */
export interface JrActionDispatcher {
  dispatch(ctx: JrActionContext): void | Promise<void>;
}

/** DI token for the {@link JrActionDispatcher}. */
export const JR_ACTION_DISPATCHER = new InjectionToken<JrActionDispatcher>(
  'JR_ACTION_DISPATCHER',
);

/** Options for {@link provideJsonRender}. */
export interface ProvideJsonRenderOptions {
  /** A default registry used by `JrRenderer` when no `[registry]` input is set. */
  registry?: JrRegistry;
  /** Map of action name → handler, invoked when a component emits that action. */
  actions?: Record<string, JrActionHandler>;
}

/**
 * Register json-render defaults for the application (or a route).
 *
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideJsonRender({
 *       registry: primitivesRegistry,
 *       actions: { export_report: async () => { ... } },
 *     }),
 *   ],
 * };
 * ```
 */
export function provideJsonRender(
  options: ProvideJsonRenderOptions = {},
): EnvironmentProviders {
  const providers = [];

  if (options.registry) {
    providers.push({ provide: JR_REGISTRY, useValue: options.registry });
  }

  const actions = options.actions;
  if (actions) {
    const dispatcher: JrActionDispatcher = {
      dispatch: (ctx) => actions[ctx.action]?.(ctx),
    };
    providers.push({ provide: JR_ACTION_DISPATCHER, useValue: dispatcher });
  }

  return makeEnvironmentProviders(providers);
}
