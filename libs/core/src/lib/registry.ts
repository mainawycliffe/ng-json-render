import { InjectionToken, type Type } from '@angular/core';
import type { JrRegistry } from './types';

/** DI token for a default {@link JrRegistry} provided via `provideJsonRender`. */
export const JR_REGISTRY = new InjectionToken<JrRegistry>('JR_REGISTRY');

/**
 * Build a {@link JrRegistry} from a map of catalog `type` → Angular component class.
 *
 * ```ts
 * const registry = defineRegistry({
 *   Stack: JrStack,
 *   Text: JrText,
 *   Button: JrButton,
 * });
 * ```
 */
export function defineRegistry(
  components: Record<string, Type<unknown>>,
): JrRegistry {
  return { components: { ...components } };
}

/** Merge multiple registries; later entries win on conflicting keys. */
export function mergeRegistries(...registries: JrRegistry[]): JrRegistry {
  return {
    components: Object.assign({}, ...registries.map((r) => r.components)),
  };
}
