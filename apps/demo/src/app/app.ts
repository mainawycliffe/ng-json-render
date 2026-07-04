import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  type JrActionEvent,
  JrRenderer,
  type Spec,
} from '@ng-json-render/core';
import { primitivesRegistry } from '@ng-json-render/primitives';
import { DEMO_SPEC } from './demo-spec';

@Component({
  selector: 'app-root',
  imports: [JrRenderer],
  template: `
    <div
      class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <header
        class="border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70"
      >
        <div
          class="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-3"
        >
          <div class="flex items-center gap-2 font-semibold">
            <span
              class="grid h-6 w-6 place-items-center rounded bg-indigo-600 text-xs text-white"
              >JR</span
            >
            ng-json-render
          </div>
          <span class="text-xs text-zinc-500 dark:text-zinc-400"
            >Generative UI · rendered by Angular</span
          >
        </div>
      </header>

      <main class="px-6 py-8">
        <jr-renderer
          [spec]="spec()"
          [registry]="registry"
          (action)="onAction($event)"
        />
      </main>

      @if (lastAction(); as a) {
        <div
          class="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
        >
          Action dispatched: <code class="font-medium">{{ a }}</code>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly registry = primitivesRegistry;
  protected readonly spec = signal<Spec>(DEMO_SPEC);
  protected readonly lastAction = signal<string | null>(null);

  protected onAction(event: JrActionEvent): void {
    this.lastAction.set(`${event.action} (#${event.nodeId})`);
    setTimeout(() => this.lastAction.set(null), 2500);
  }
}
