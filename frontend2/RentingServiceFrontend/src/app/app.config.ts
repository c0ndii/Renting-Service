import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { MatDialogRef } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from './services/auth.service';
import { NavbarService } from './services/navbar.service';
import { SnackbarService } from './services/snackbar.service';
import { GalleryModule } from 'ng-gallery';
import { NgImageSliderModule } from 'ng-image-slider';
import localePl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './list-layout/custom-paginator';

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: jwtInterceptor,
      multi: true,
    },
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    AuthService,
    NavbarService,
    SnackbarService,
    GalleryModule,
    NgImageSliderModule,
    {
      provide: LOCALE_ID,
      useValue: 'pl-PL',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'PLN',
    },
    {
      provide: MatPaginatorIntl,
      useValue: CustomPaginator(),
    },
  ],
};
