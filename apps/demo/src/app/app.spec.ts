import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('renders the dashboard spec into live components', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Heading from the spec.
    expect(compiled.querySelector('jr-heading')?.textContent).toContain(
      'Analytics',
    );
    // Data-viz + table rendered dynamically.
    expect(compiled.querySelector('table')).toBeTruthy();
    expect(compiled.querySelectorAll('svg').length).toBeGreaterThan(0);
    // The settings form's Save button.
    const buttons = Array.from(compiled.querySelectorAll('button'));
    expect(buttons.some((b) => b.textContent?.includes('Save changes'))).toBe(
      true,
    );
  });
});
