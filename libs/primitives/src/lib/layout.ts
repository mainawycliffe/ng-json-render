import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/** Centered, max-width page container. */
@Component({
  selector: 'jr-container',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
    '[style.max-width]': 'maxWidthValue()',
    '[style.margin-inline]': '"auto"',
  },
})
export class JrContainer {
  readonly maxWidth = input<number | string>(960);
  protected readonly maxWidthValue = computed(() => {
    const w = this.maxWidth();
    return typeof w === 'number' ? `${w}px` : w;
  });
}

/** Flexbox stack (row or column) with configurable gap and alignment. */
@Component({
  selector: 'jr-stack',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: flex; box-sizing: border-box;',
    '[style.flex-direction]': 'direction()',
    '[style.gap]': 'gapValue()',
    '[style.align-items]': 'align()',
    '[style.justify-content]': 'justify()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : null',
  },
})
export class JrStack {
  readonly direction = input<'row' | 'column'>('column');
  readonly gap = input<number | string>(12);
  readonly align = input<string>();
  readonly justify = input<string>();
  readonly wrap = input(false);

  protected readonly gapValue = computed(() => {
    const g = this.gap();
    return typeof g === 'number' ? `${g}px` : g;
  });
}

/** Responsive grid with a fixed number of columns. */
@Component({
  selector: 'jr-grid',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: grid; box-sizing: border-box;',
    '[style.grid-template-columns]': 'templateColumns()',
    '[style.gap]': 'gapValue()',
  },
})
export class JrGrid {
  readonly columns = input<number>(2);
  readonly gap = input<number | string>(16);

  protected readonly templateColumns = computed(
    () => `repeat(${this.columns()}, minmax(0, 1fr))`,
  );
  protected readonly gapValue = computed(() => {
    const g = this.gap();
    return typeof g === 'number' ? `${g}px` : g;
  });
}

/** Bordered surface with an optional title/subtitle. */
@Component({
  selector: 'jr-card',
  template: `
    @if (title() || subtitle()) {
      <div class="mb-3">
        @if (title()) {
          <div
            class="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {{ title() }}
          </div>
        }
        @if (subtitle()) {
          <div class="text-xs text-zinc-500 dark:text-zinc-400">
            {{ subtitle() }}
          </div>
        }
      </div>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900',
  },
})
export class JrCard {
  readonly title = input<string>();
  readonly subtitle = input<string>();
}

/** Horizontal rule. */
@Component({
  selector: 'jr-divider',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-t border-zinc-200 dark:border-zinc-800',
    role: 'separator',
  },
})
export class JrDivider {}
