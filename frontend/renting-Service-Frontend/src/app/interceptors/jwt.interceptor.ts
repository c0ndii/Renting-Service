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
        this.router.navigate(['login']);
        console.log("Token expired");
        return next.handle(req);
      }
      console.log("Token not expired");
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
