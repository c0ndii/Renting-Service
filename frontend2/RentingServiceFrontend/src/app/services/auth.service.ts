import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit } from '@angular/core';
import { backendUrlBase } from '../appsettings/constant';
import { loginDto } from '../interfaces/loginDto';
import { registerDto } from '../interfaces/registerDto';
import { userDto } from '../interfaces/userDto';
import { tokenDto } from '../interfaces/tokenDto';
import { refreshTokenDto } from '../interfaces/refreshTokenDto';
import { BehaviorSubject, Observable } from 'rxjs';
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
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  private user = new BehaviorSubject<userDto>({} as userDto);
  private username = new BehaviorSubject<string>('');
  private picture = new BehaviorSubject<string>('');
  public set UserName(username: string) {
    this.username.next(username);
  }
  public get UserName(): Observable<string> {
    return this.username.asObservable();
  }
  public set Picture(picture: string) {
    this.picture.next(picture);
  }
  public get Picture(): Observable<string> {
    return this.picture.asObservable();
  }
  isUserLoggedIn(): boolean {
    if (this.getRole() != null) {
      return true;
    }
    return false;
  }
  public userOnReload() {
    if (this.isUserLoggedIn()) {
      var username = this.getUserName();
      var picture = this.getUserPicture();
      if (username) {
        this.UserName = username;
      }
      if (picture) {
        this.Picture = picture;
      }
    }
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
  //USER
  getUserFetch(): Observable<userDto> {
    return this.http.get<userDto>(backendUrlBase + 'user/getuser');
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
  getUserFromLocalStorage() {
    if (this.localStorage) {
      var user = this.localStorage.getItem('User');
      if (user) {
        return JSON.parse(user);
      }
    }
  }
  getUserName(): string | undefined {
    if (this.localStorage) {
      var user = this.localStorage.getItem('User');
      if (user) {
        var userDto = JSON.parse(user) as userDto;
        return userDto.name;
      }
    }
    return undefined;
  }
  getUserPicture(): string | undefined {
    if (this.localStorage) {
      var user = this.localStorage.getItem('User');
      if (user) {
        var userDto = JSON.parse(user) as userDto;
        return userDto.picture;
      }
    }
    return undefined;
  }
  changeName(name: string) {
    if (this.localStorage) {
      var user = this.localStorage.getItem('User');
      if (user) {
        var userDto = JSON.parse(user) as userDto;
        userDto.name = name;
        this.setUser(userDto);
      }
    }
  }
  changePicture(picture: string) {
    if (this.localStorage) {
      var user = this.localStorage.getItem('User');
      if (user) {
        var userDto = JSON.parse(user) as userDto;
        userDto.picture = picture;
        this.setUser(userDto);
      }
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
  loginUser(userDto: loginDto) {
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
    this.getUserFetch().subscribe((response) => {
      this.setUser(response);
    });
  }
  logout() {
    this.removeJwtToken();
    this.removeRefreshToken();
    this.removeUser();
    //this.router.navigate(['']);
  }
}
