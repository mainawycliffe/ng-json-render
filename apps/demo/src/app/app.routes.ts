import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    title: 'ng-json-render · Overview',
    loadComponent: () =>
      import('./pages/overview.page').then((m) => m.OverviewPage),
  },
  {
    path: 'dashboard',
    title: 'ng-json-render · Dashboard',
    loadComponent: () =>
      import('./pages/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'components',
    title: 'ng-json-render · Components',
    loadComponent: () =>
      import('./pages/components.page').then((m) => m.ComponentsPage),
  },
  {
    path: 'custom',
    title: 'ng-json-render · Custom components',
    loadComponent: () =>
      import('./pages/custom.page').then((m) => m.CustomPage),
  },
  { path: '**', redirectTo: '' },
];
