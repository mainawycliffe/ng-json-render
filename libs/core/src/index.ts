export { JrRenderer } from './lib/jr-renderer';
export { JR_CONTEXT, type JrContext, injectJrContext } from './lib/jr-context';
export { JrStateStore } from './lib/state-store';
export { JR_REGISTRY, defineRegistry, mergeRegistries } from './lib/registry';
export {
  JR_ACTION_DISPATCHER,
  type JrActionDispatcher,
  type ProvideJsonRenderOptions,
  provideJsonRender,
} from './lib/providers';
export type {
  JrRegistry,
  JrActionHandler,
  JrActionContext,
  JrActionEvent,
  Spec,
  UIElement,
} from './lib/types';

// Re-export the framework-agnostic building blocks so consumers can define
// catalogs, validate specs, and drive streaming from one import.
export {
  defineSchema,
  defineCatalog,
  validateSpec,
  createSpecStreamCompiler,
  compileSpecStream,
} from '@json-render/core';
export type { Catalog, Schema } from '@json-render/core';
