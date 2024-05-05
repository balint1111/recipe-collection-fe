import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { hu_HU, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import hu from '@angular/common/locales/hu';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthService} from "./service/auth.service";
import {RequestService} from "./service/request.service";
import {authInterceptor} from "./http-interceptors/auth.interceptor";

registerLocaleData(hu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzIcons(),
    provideNzI18n(hu_HU),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    AuthService,
    RequestService
  ]
};
