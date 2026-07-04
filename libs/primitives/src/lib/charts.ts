import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/** A single {label, value} datum for charts. */
export interface ChartDatum {
  label: string;
  value: number;
}

/** Responsive CSS bar chart (no chart library). */
@Component({
  selector: 'jr-bar-chart',
  template: `
    <div class="flex items-end gap-2" [style.height.px]="height()">
      @for (d of data(); track $index) {
        <div class="flex h-full flex-1 items-end">
          <div
            class="w-full rounded-t-md bg-indigo-500 transition-[height] duration-300 dark:bg-indigo-400"
            [style.height.%]="pct(d.value)"
            [title]="d.label + ': ' + d.value"
          ></div>
        </div>
      }
    </div>
    <div class="mt-1.5 flex gap-2">
      @for (d of data(); track $index) {
        <div
          class="flex-1 truncate text-center text-xs text-zinc-500 dark:text-zinc-400"
        >
          {{ d.label }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrBarChart {
  readonly data = input<ChartDatum[]>([]);
  readonly height = input(160);
  private readonly max = computed(() =>
    Math.max(1, ...this.data().map((d) => d.value)),
  );
  protected pct(value: number): number {
    return Math.max(2, (value / this.max()) * 100);
  }
}

/** Responsive SVG line/area chart (no chart library). */
@Component({
  selector: 'jr-line-chart',
  template: `
    <svg
      viewBox="0 0 300 100"
      preserveAspectRatio="none"
      class="w-full"
      [style.height.px]="height()"
      aria-hidden="true"
    >
      @if (geom().line) {
        <polygon
          [attr.points]="geom().area"
          class="fill-indigo-500/10 dark:fill-indigo-400/10"
        />
        <polyline
          [attr.points]="geom().line"
          fill="none"
          class="stroke-indigo-500 dark:stroke-indigo-400"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
      }
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrLineChart {
  readonly data = input<number[]>([]);
  readonly height = input(120);

  protected readonly geom = computed(() => {
    const d = this.data();
    if (d.length < 2) return { line: '', area: '' };
    const w = 300;
    const h = 100;
    const max = Math.max(...d);
    const min = Math.min(...d);
    const range = max - min || 1;
    const step = w / (d.length - 1);
    const pts = d.map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h * 0.9) - h * 0.05;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return { line: pts.join(' '), area: `0,${h} ${pts.join(' ')} ${w},${h}` };
  });
}
