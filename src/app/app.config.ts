import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authJwtInterceptor } from './helpers/interceptors/auth-jwt.interceptor';
import { jsonDateInterceptorInterceptor } from './helpers/interceptors/json-date-interceptor.interceptor';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([authJwtInterceptor, jsonDateInterceptorInterceptor])),
        { provide: LOCALE_ID, useValue: 'es' }
    ]
};
