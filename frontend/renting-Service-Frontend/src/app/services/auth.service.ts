import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendUrlBase } from '../appsettings/constant';
import { loginDto } from '../interfaces/loginDto';
import { registerDto } from '../interfaces/registerDto';
import { userDto } from '../interfaces/userDto';
import { tokenDto } from '../interfaces/tokenDto';
import { refreshTokenDto } from '../interfaces/refreshTokenDto';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  user: userDto | null = null;

  getJwtToken(){
    return localStorage.getItem('Authorization');
  }
  setJwtToken(token: string){
    return localStorage.setItem('Authorization', 'Bearer '+token);
  }
  getRefreshToken(){
    return localStorage.getItem('RefreshToken');
  }
  setRefreshToken(token: string){
    return localStorage.setItem('RefreshToken', token);
  }
  removeJwtToken(){
    return localStorage.removeItem('Authorization');
  }
  removeRefreshToken(){
    return localStorage.removeItem('RefreshToken');
  }
  getUser():Observable<userDto>{
    return this.http.get<userDto>(backendUrlBase + 'user/getusername');
  }
  setUser(user: userDto){
    this.user = user;
  }
  removeUser(){
    this.user = null;
  }
  loginUser(userDto: loginDto){
    return this.http.post<tokenDto>(backendUrlBase + 'auth/login', userDto);
  }
  registerUser(userDto: registerDto){
    return this.http.post(backendUrlBase + 'auth/register', userDto);
  }
  refreshToken(refreshTokenDto: refreshTokenDto) {
    return this.http.post<tokenDto>(backendUrlBase + 'auth/refreshtoken', refreshTokenDto);
  }
  revokeToken(){
    return this.http.delete(backendUrlBase + 'auth/revoketoken');
    //logout
  }
}
