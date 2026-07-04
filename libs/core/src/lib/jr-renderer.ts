import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  type EffectRef,
  EnvironmentInjector,
  Injector,
  type Type,
  ViewContainerRef,
  effect,
  inject,
  input,
  output,
  reflectComponentType,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  type Spec,
  type StateModel,
  type UIElement,
  evaluateVisibility,
  resolveBindings,
  resolveElementProps,
} from '@json-render/core';
import { JR_CONTEXT, type JrContext } from './jr-context';
import { JR_ACTION_DISPATCHER } from './providers';
import { JR_REGISTRY } from './registry';
import { JrStateStore } from './state-store';
import type { JrActionEvent, JrRegistry } from './types';

/** Iteration scope threaded through the recursive build (`$item` / `$index`). */
interface RenderScope {
  readonly item: unknown;
  readonly index: number;
}

const ROOT_SCOPE: RenderScope = { item: undefined, index: -1 };

/**
 * Renders a json-render {@link Spec} into native Angular components.
 *
 * ```html
 * <jr-renderer [spec]="spec()" [registry]="registry" (action)="onAction($event)" />
 * ```
 *
 * The spec is a flat tree of typed elements; each `type` is resolved against the
 * {@link JrRegistry} (from the `[registry]` input or `provideJsonRender`) and
 * instantiated dynamically. Children are projected into each component's
 * `<ng-content>`.
 *
 * Structural changes (the spec itself) rebuild the tree; state changes update
 * individual nodes' inputs in place via per-node effects — so bound inputs stay
 * live and keep focus. Props declaring `$bindState` two-way bind to a component's
 * `model()` (Signal Forms `FormValueControl` / `FormCheckboxControl`).
 */
@Component({
  selector: 'jr-renderer',
  template: `<ng-container #anchor />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [JrStateStore],
})
export class JrRenderer {
  /** The spec to render. */
  readonly spec = input<Spec | null>(null);
  /** Registry mapping component types to Angular classes (overrides the DI default). */
  readonly registry = input<JrRegistry | null>(null);
  /** Initial/overriding runtime state merged on top of `spec.state`. */
  readonly state = input<StateModel | undefined>(undefined);
  /** Emits whenever a rendered component raises an action. */
  readonly action = output<JrActionEvent>();

  private readonly anchor = viewChild.required('anchor', {
    read: ViewContainerRef,
  });

  private readonly store = inject(JrStateStore);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly fallbackRegistry = inject(JR_REGISTRY, { optional: true });
  private readonly dispatcher = inject(JR_ACTION_DISPATCHER, {
    optional: true,
  });

  /** Per-node effects (prop resolution + two-way bindings), torn down on rebuild. */
  private readonly effects: EffectRef[] = [];

  constructor() {
    // Feed spec/state inputs into the store.
    effect(() => {
      const spec = this.spec();
      if (!spec) return;
      const extra = this.state();
      const merged: Spec = extra
        ? { ...spec, state: { ...(spec.state ?? {}), ...extra } }
        : spec;
      untracked(() => this.store.setSpec(merged));
    });

    // Rebuild the DOM only when the spec (structure) changes. State-driven prop
    // updates are handled per node, without rebuilding.
    effect((onCleanup) => {
      const vcr = this.anchor();
      const spec = this.store.spec();
      untracked(() => this.render(vcr, spec));
      onCleanup(() => this.teardown(vcr));
    });
  }

  private render(vcr: ViewContainerRef, spec: Spec | null): void {
    this.teardown(vcr);
    if (!spec?.root) return;
    const registry = this.registry() ?? this.fallbackRegistry;
    if (!registry) {
      console.warn(
        '[json-render] No registry provided (set [registry] or use provideJsonRender).',
      );
      return;
    }
    this.buildNode(vcr, spec.root, registry, ROOT_SCOPE);
  }

  private buildNode(
    vcr: ViewContainerRef,
    id: string,
    registry: JrRegistry,
    scope: RenderScope,
  ): ComponentRef<unknown> | null {
    const element = this.store.getElement(id);
    if (!element) return null;

    if (element.visible !== undefined && !this.isVisible(element, scope)) {
      return null;
    }

    const cmp = registry.components[element.type];
    if (!cmp) {
      console.warn(
        `[json-render] No component registered for type "${element.type}".`,
      );
      return null;
    }

    // Build children first so their host nodes can be projected into <ng-content>.
    const childNodes: Node[] = [];
    for (const childId of element.children ?? []) {
      const childRef = this.buildNode(vcr, childId, registry, scope);
      if (childRef) childNodes.push(childRef.location.nativeElement as Node);
    }

    const ref = vcr.createComponent(cmp, {
      injector: this.makeNodeInjector(id, element, scope),
      environmentInjector: this.envInjector,
      projectableNodes: [childNodes],
    });

    const mirror = reflectComponentType(cmp);
    const inputNames = new Set(mirror?.inputs.map((i) => i.templateName) ?? []);
    this.bindProps(ref, element, scope, inputNames);
    this.bindTwoWay(ref, element, mirror, inputNames);
    return ref;
  }

  /** Reactively resolve and apply props; re-runs when referenced state changes. */
  private bindProps(
    ref: ComponentRef<unknown>,
    element: UIElement,
    scope: RenderScope,
    inputNames: ReadonlySet<string>,
  ): void {
    const eff = effect(
      () => {
        const resolved = resolveElementProps(element.props ?? {}, {
          stateModel: this.store.state(),
          repeatItem: scope.item,
          repeatIndex: scope.index,
        });
        untracked(() => {
          for (const [key, value] of Object.entries(resolved)) {
            if (inputNames.has(key)) ref.setInput(key, value);
          }
          if (inputNames.has('props')) ref.setInput('props', resolved);
        });
      },
      { injector: this.injector },
    );
    this.effects.push(eff);
  }

  /**
   * Wire two-way `$bindState` props to a component's `model()` output. Works with
   * any Signal Forms control (`value`/`checked` model), writing edits back to state.
   */
  private bindTwoWay(
    ref: ComponentRef<unknown>,
    element: UIElement,
    mirror: ReturnType<typeof reflectComponentType>,
    inputNames: ReadonlySet<string>,
  ): void {
    if (!mirror) return;
    const bindings = resolveBindings(element.props ?? {}, {
      stateModel: this.store.snapshot(),
    });
    if (!bindings) return;

    const outputs = new Set(mirror.outputs.map((o) => o.templateName));
    const instance = ref.instance as Record<string, unknown>;

    for (const [prop, path] of Object.entries(bindings)) {
      // A model() prop exposes a matching `<prop>Change` output.
      if (!inputNames.has(prop) || !outputs.has(`${prop}Change`)) continue;
      const modelSignal = instance[prop];
      if (typeof modelSignal !== 'function') continue;

      const eff = effect(
        () => {
          const next = (modelSignal as () => unknown)();
          untracked(() => {
            if (this.store.getStatePath(path) !== next) {
              this.store.setStatePath(path, next);
            }
          });
        },
        { injector: this.injector },
      );
      this.effects.push(eff);
    }
  }

  private makeNodeInjector(
    id: string,
    element: UIElement,
    scope: RenderScope,
  ): Injector {
    const item = signal(scope.item);
    const index = signal(scope.index);
    const context: JrContext = {
      nodeId: id,
      item: item.asReadonly(),
      index: index.asReadonly(),
      emit: (event, payload) => this.handleEmit(id, element, event, payload),
    };
    return Injector.create({
      providers: [{ provide: JR_CONTEXT, useValue: context }],
      parent: this.injector,
    });
  }

  private isVisible(element: UIElement, scope: RenderScope): boolean {
    return evaluateVisibility(element.visible, {
      stateModel: this.store.snapshot(),
      repeatItem: scope.item,
      repeatIndex: scope.index,
    });
  }

  private handleEmit(
    nodeId: string,
    element: UIElement,
    event: string,
    payload: unknown,
  ): void {
    const binding = element.on?.[event];
    const action = Array.isArray(binding)
      ? (binding[0]?.action ?? event)
      : (binding?.action ?? event);

    const ctx = { action, payload, nodeId, element };
    void this.dispatcher?.dispatch(ctx);

    const spec = this.store.spec();
    if (spec) this.action.emit({ ...ctx, spec });
  }

  private teardown(vcr: ViewContainerRef): void {
    for (const eff of this.effects) eff.destroy();
    this.effects.length = 0;
    vcr.clear();
  }
}
