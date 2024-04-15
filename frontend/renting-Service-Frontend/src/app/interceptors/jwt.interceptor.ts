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
import { refreshTokenDto } from '../interfaces/refreshTokenDto';
import { tokenDto } from '../interfaces/tokenDto';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  tokenDto = {} as tokenDto;
  refreshTokenDto = {} as refreshTokenDto;
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getJwtToken();
    const refreshToken = this.authService.getRefreshToken();
    if (token && refreshToken) {
      let decodedToken = jwtDecode(token);
      const tokenExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;
      if(tokenExpired) {
        this.refreshTokenDto.accessToken = this.authService.getJwtToken();
        this.refreshTokenDto.refreshToken = this.authService.getRefreshToken();
        this.authService.refreshToken(this.refreshTokenDto).subscribe((token) =>{
          this.tokenDto = token;
        });
        if(this.tokenDto.refreshToken !== undefined && this.tokenDto.refreshToken !== undefined){
          this.authService.setJwtToken("Bearer "+this.tokenDto.jwtToken);
        } else {
          this.authService.logout();
          this.router.navigate(['login']);
          return next.handle(req);
        }
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
            this.authService.logout();
            return next.handle(req);
          }
          return next.handle(reqWithToken);
        })
      );
    }
    this.authService.logout();
    return next.handle(req);
  }
}
