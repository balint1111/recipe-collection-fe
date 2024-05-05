import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {Observable} from "rxjs";
import {AuthService} from "../service/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).getToken();

  if (authToken == null) {
    return next(req);
  } else {
    return next(req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    }))
  }

}
