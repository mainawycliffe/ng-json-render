import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideJsonRender } from '@ng-json-render/core';
import { primitivesRegistry } from '@ng-json-render/primitives';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    // Default registry for every <jr-renderer> that doesn't set [registry].
    provideJsonRender({ registry: primitivesRegistry }),
  ],
};
