import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit } from '@angular/core';
import { backendUrlBase } from '../appsettings/constant';
import { loginDto } from '../interfaces/loginDto';
import { registerDto } from '../interfaces/registerDto';
import { userDto } from '../interfaces/userDto';
import { tokenDto } from '../interfaces/tokenDto';
import { refreshTokenDto } from '../interfaces/refreshTokenDto';
import { BehaviorSubject, delay, finalize, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { resetPasswordDto } from '../interfaces/resetPasswordDto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  localStorage: Storage | undefined;
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  public user = new BehaviorSubject<userDto>({} as userDto);
  public role = new BehaviorSubject<string>('');

  getUserFromStorage() {
    var user = this.localStorage!.getItem('User');
    if (user) {
      return JSON.parse(user) as userDto;
    }
    return {} as userDto;
  }

  getUserFromFetch() {
    return this.http.get<userDto>(backendUrlBase + 'user/getuser');
  }

  userLogged(): boolean {
    if (this.user.value.userId > 0) {
      return true;
    }
    return false;
  }

  setUser(user: userDto) {
    if (this.localStorage) {
      return this.localStorage.setItem('User', JSON.stringify(user));
    }
  }

  removeUser() {
    if (this.localStorage) {
      return this.localStorage.removeItem('User');
    }
  }

  changePicture(image: string) {
    const user = this.user.value;
    user.picture = image;
    this.setUser(user);
    this.user.next(user);
  }

  changeName(name: string) {
    const user = this.user.value;
    user.name = name;
    this.setUser(user);
    this.user.next(user);
  }

  //JWT
  getJwtToken() {
    if (this.localStorage) {
      return this.localStorage.getItem('Authorization');
    }
    return null;
  }
  setJwtToken(token: string) {
    if (this.localStorage) {
      return this.localStorage.setItem('Authorization', 'Bearer ' + token);
    }
  }
  removeJwtToken() {
    if (this.localStorage) {
      return this.localStorage.removeItem('Authorization');
    }
  }
  //REFRESH
  getRefreshToken() {
    if (this.localStorage) {
      return this.localStorage.getItem('RefreshToken');
    }
    return null;
  }
  setRefreshToken(token: string) {
    if (this.localStorage) {
      return this.localStorage.setItem('RefreshToken', token);
    }
  }
  removeRefreshToken() {
    if (this.localStorage) {
      return this.localStorage.removeItem('RefreshToken');
    }
  }

  //ROLE
  getRole(): string | null {
    var token = this.getJwtToken()?.split(' ', 2);
    var result = token && token[1];
    if (result) {
      var decodedJwtRole = JSON.parse(window.atob(result.split('.')[1]))[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
      return decodedJwtRole;
    }
    return null;
  }

  //AUTH
  public loginUser(userDto: loginDto) {
    return this.http.post<tokenDto>(backendUrlBase + 'auth/login', userDto);
  }
  registerUser(userDto: registerDto) {
    return this.http.post(backendUrlBase + 'auth/register', userDto);
  }
  refreshToken(refreshTokenDto: refreshTokenDto) {
    return this.http.post<tokenDto>(
      backendUrlBase + 'auth/refreshtoken',
      refreshTokenDto
    );
  }
  revokeToken() {
    return this.http.delete(backendUrlBase + 'auth/revoketoken');
    //logout
  }
  verifyAccount(code: string) {
    return this.http.get(backendUrlBase + 'auth/verifyemail/' + code);
  }
  sendPasswordResetCode(mail: string) {
    return this.http.get(backendUrlBase + 'auth/forgotpassword/' + mail);
  }
  resetPassword(resetPasswordDto: resetPasswordDto) {
    return this.http.post(
      backendUrlBase + 'auth/resetpassword',
      resetPasswordDto
    );
  }
  login(token: tokenDto) {
    this.setJwtToken(token.jwtToken);
    this.setRefreshToken(token.refreshToken);
    this.getUserFromFetch().subscribe((response: userDto) => {
      this.setUser(response);
      this.user.next(response);
      window.location.reload();
    });
  }
  logout() {
    this.removeJwtToken();
    this.removeRefreshToken();
    this.removeUser();
    this.user.next({} as userDto);
    this.router.navigate(['']);
  }
  logoutInterceptor() {
    this.removeJwtToken();
    this.removeRefreshToken();
    this.removeUser();
    this.user.next({} as userDto);
  }
}
