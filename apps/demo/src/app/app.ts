import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavLink {
  path: string;
  label: string;
  exact: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div
      class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <header
        class="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <div
          class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3"
        >
          <a routerLink="/" class="flex items-center gap-2 font-semibold">
            <span
              class="grid h-6 w-6 place-items-center rounded bg-indigo-600 text-xs text-white"
              >JR</span
            >
            ng-json-render
          </a>
          <nav class="flex items-center gap-4 text-xs">
            <a
              href="https://json-render.dev/docs"
              target="_blank"
              rel="noreferrer"
              class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >json-render docs</a
            >
            <a
              href="https://github.com/mainawycliffe/ng-json-render"
              target="_blank"
              rel="noreferrer"
              class="font-medium text-zinc-600 hover:underline dark:text-zinc-300"
              >GitHub</a
            >
          </nav>
        </div>
      </header>

      <div class="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <aside class="hidden w-52 shrink-0 md:block">
          <nav class="sticky top-20 flex flex-col gap-1 text-sm">
            @for (link of nav; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                [routerLinkActiveOptions]="{ exact: link.exact }"
                class="rounded-lg px-3 py-2 font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </aside>

        <main class="min-w-0 flex-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly nav: NavLink[] = [
    { path: '/', label: 'Overview', exact: true },
    { path: '/dashboard', label: 'Dashboard', exact: false },
    { path: '/components', label: 'Components', exact: false },
    { path: '/custom', label: 'Custom components', exact: false },
  ];
}
