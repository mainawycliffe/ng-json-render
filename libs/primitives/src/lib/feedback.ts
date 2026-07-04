import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

const ALERT_TONES: Record<string, string> = {
  info: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
  danger:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200',
};

/** Inline callout / alert banner. */
@Component({
  selector: 'jr-alert',
  template: `
    @if (title()) {
      <div class="font-medium">{{ title() }}</div>
    }
    <div class="text-sm" [class.mt-0.5]="!!title()">
      {{ message() }}<ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'alert',
    '[class]': 'toneClass()',
  },
})
export class JrAlert {
  readonly title = input<string>();
  readonly message = input('');
  readonly tone = input<'info' | 'success' | 'warning' | 'danger'>('info');
  protected readonly toneClass = computed(
    () =>
      'block rounded-lg border px-4 py-3 ' +
      (ALERT_TONES[this.tone()] ?? ALERT_TONES['info']),
  );
}

/** Determinate progress bar (0–100). */
@Component({
  selector: 'jr-progress',
  template: `
    <div
      class="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
    >
      <div
        class="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
        [style.width.%]="clamped()"
      ></div>
    </div>
    @if (label()) {
      <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {{ label() }} · {{ clamped() }}%
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrProgress {
  readonly value = input<number>(0);
  readonly label = input<string>();
  protected readonly clamped = computed(() =>
    Math.max(0, Math.min(100, Math.round(this.value()))),
  );
}
