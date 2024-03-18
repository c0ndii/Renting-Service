import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const reqWithToken = req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer + ${token}`,
          'Content-Type': 'application/json',
        }),
      });
      return next.handle(reqWithToken);
    }
    return next.handle(req);
  }
}
