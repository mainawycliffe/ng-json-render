import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/** Section heading (levels 1–4). */
@Component({
  selector: 'jr-heading',
  template: `{{ value() }}<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'sizeClass()',
  },
})
export class JrHeading {
  readonly value = input('');
  readonly level = input<1 | 2 | 3 | 4>(2);

  protected readonly sizeClass = computed(() => {
    const base =
      'block font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 ';
    return (
      base +
      { 1: 'text-3xl', 2: 'text-2xl', 3: 'text-lg', 4: 'text-base' }[
        this.level()
      ]
    );
  });
}

/** Body text. */
@Component({
  selector: 'jr-text',
  template: `{{ value() }}<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'text-zinc-600 dark:text-zinc-300',
    '[class.font-medium]': 'weight() === "medium"',
    '[class.font-semibold]': 'weight() === "bold"',
    '[class.text-sm]': 'size() === "sm"',
    '[class.text-xs]': 'size() === "xs"',
    '[class.text-lg]': 'size() === "lg"',
  },
})
export class JrText {
  readonly value = input('');
  readonly weight = input<'normal' | 'medium' | 'bold'>('normal');
  readonly size = input<'xs' | 'sm' | 'base' | 'lg'>('base');
}

const BADGE_TONES: Record<string, string> = {
  neutral:
    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  info: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
};

/** Small status pill. */
@Component({
  selector: 'jr-badge',
  template: `{{ label() }}<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'toneClass()',
  },
})
export class JrBadge {
  readonly label = input('');
  readonly tone = input<'neutral' | 'success' | 'warning' | 'danger' | 'info'>(
    'neutral',
  );
  protected readonly toneClass = computed(
    () =>
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
      (BADGE_TONES[this.tone()] ?? BADGE_TONES['neutral']),
  );
}

/** KPI tile: a big value with a label and an optional delta. */
@Component({
  selector: 'jr-stat',
  template: `
    <div class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
      {{ label() }}
    </div>
    <div class="mt-1 flex items-baseline gap-2">
      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {{ value() }}
      </span>
      @if (delta() !== null) {
        <span
          class="text-xs font-medium"
          [class.text-emerald-600]="(delta() ?? 0) >= 0"
          [class.text-red-600]="(delta() ?? 0) < 0"
        >
          {{ (delta() ?? 0) >= 0 ? '▲' : '▼' }} {{ absDelta() }}%
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrStat {
  readonly label = input('');
  readonly value = input<string | number>('');
  readonly delta = input<number | null>(null);
  protected readonly absDelta = computed(() => Math.abs(this.delta() ?? 0));
}
