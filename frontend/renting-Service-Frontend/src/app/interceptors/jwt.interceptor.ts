import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      let decodedToken = jwtDecode(token);
      const tokenExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;
      if(tokenExpired) {
        this.authService.removeToken();
        this.authService.removeUser();
        this.router.navigate(['login']);
        return next.handle(req);
      }
      const reqWithToken = req.clone({
        headers: new HttpHeaders({
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        }),
      });
      return next.handle(reqWithToken).pipe(
        map(res => {
          return res;
        }),
        catchError((error: HttpErrorResponse) => {
          if(error.status == 401) {
            this.authService.removeToken();
            this.authService.removeUser();
            return next.handle(req);
          }
          return next.handle(reqWithToken);
        })
      );
    }
    return next.handle(req);
  }
}
