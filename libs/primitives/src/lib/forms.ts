import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { JR_CONTEXT } from '@ng-json-render/core';

// Note: these controls expose a `value` / `checked` model(), which *structurally*
// satisfies Angular's Signal Forms `FormValueControl` / `FormCheckboxControl`
// contracts — so on Angular 21 they work with the `[field]` directive — without
// importing `@angular/forms/signals`, keeping the package usable on Angular 19+.

const FIELD_LABEL =
  'text-sm font-medium text-zinc-700 dark:text-zinc-300';
const CONTROL =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';

/**
 * Text input. A Signal Forms Signal Forms value control — usable with the `[field]`
 * directive, or driven by `$bindState` through the renderer.
 */
@Component({
  selector: 'jr-input',
  template: `
    <label class="flex flex-col gap-1.5">
      @if (label()) {
        <span [class]="labelClass">{{ label() }}</span>
      }
      <input
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        [class]="controlClass"
        (input)="value.set(read($event))"
      />
      @if (hint()) {
        <span class="text-xs text-zinc-500 dark:text-zinc-400">{{
          hint()
        }}</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrInput {
  readonly value = model('');
  readonly label = input<string>();
  readonly placeholder = input('');
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');
  readonly hint = input<string>();
  protected readonly labelClass = FIELD_LABEL;
  protected readonly controlClass = CONTROL;
  protected read(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }
}

/** Multi-line text input (Signal Forms value control). */
@Component({
  selector: 'jr-textarea',
  template: `
    <label class="flex flex-col gap-1.5">
      @if (label()) {
        <span [class]="labelClass">{{ label() }}</span>
      }
      <textarea
        [value]="value()"
        [placeholder]="placeholder()"
        [rows]="rows()"
        [class]="controlClass"
        (input)="value.set(read($event))"
      ></textarea>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrTextarea {
  readonly value = model('');
  readonly label = input<string>();
  readonly placeholder = input('');
  readonly rows = input(3);
  protected readonly labelClass = FIELD_LABEL;
  protected readonly controlClass = CONTROL;
  protected read(e: Event): string {
    return (e.target as HTMLTextAreaElement).value;
  }
}

/** An option for {@link JrSelect}. */
export type JrSelectOption = string | { value: string; label?: string };

/** Dropdown select (Signal Forms value control). */
@Component({
  selector: 'jr-select',
  template: `
    <label class="flex flex-col gap-1.5">
      @if (label()) {
        <span [class]="labelClass">{{ label() }}</span>
      }
      <select
        [value]="value()"
        [class]="controlClass"
        (change)="value.set(read($event))"
      >
        @if (placeholder()) {
          <option value="" disabled>{{ placeholder() }}</option>
        }
        @for (opt of normalized(); track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrSelect {
  readonly value = model('');
  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly options = input<JrSelectOption[]>([]);
  protected readonly labelClass = FIELD_LABEL;
  protected readonly controlClass = CONTROL;
  protected readonly normalized = computed(() =>
    this.options().map((o) =>
      typeof o === 'string'
        ? { value: o, label: o }
        : { value: o.value, label: o.label ?? o.value },
    ),
  );
  protected read(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }
}

/** Checkbox (Signal Forms checkbox control). */
@Component({
  selector: 'jr-checkbox',
  template: `
    <label class="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        class="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-800"
        [checked]="checked()"
        (change)="checked.set(read($event))"
      />
      <span class="text-sm text-zinc-700 dark:text-zinc-300">{{
        label()
      }}</span>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrCheckbox {
  readonly checked = model(false);
  readonly label = input('');
  protected read(e: Event): boolean {
    return (e.target as HTMLInputElement).checked;
  }
}

/** Toggle switch (Signal Forms checkbox control). */
@Component({
  selector: 'jr-switch',
  template: `
    <div class="flex cursor-pointer items-center justify-between gap-3">
      <span class="text-sm text-zinc-700 dark:text-zinc-300">{{
        label()
      }}</span>
      <button
        type="button"
        role="switch"
        [attr.aria-checked]="checked()"
        (click)="checked.set(!checked())"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        [class.bg-indigo-600]="checked()"
        [class.bg-zinc-300]="!checked()"
        [class.dark:bg-zinc-700]="!checked()"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          [class.translate-x-6]="checked()"
          [class.translate-x-1]="!checked()"
        ></span>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class JrSwitch {
  readonly checked = model(false);
  readonly label = input('');
}

const BUTTON_VARIANTS: Record<string, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/40',
  secondary:
    'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
  ghost:
    'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500/40',
};

/** Button that emits the `press` action. */
@Component({
  selector: 'jr-button',
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      [disabled]="disabled()"
      (click)="ctx.emit('press')"
    >
      {{ label() }}<ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
})
export class JrButton {
  readonly label = input('');
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>(
    'primary',
  );
  readonly disabled = input(false);
  protected readonly ctx = inject(JR_CONTEXT);
  protected readonly buttonClass = computed(
    () =>
      'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none ' +
      (BUTTON_VARIANTS[this.variant()] ?? BUTTON_VARIANTS['primary']),
  );
}
