import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendUrlBase } from '../appsettings/constant';
import { loginDto } from '../interfaces/loginDto';
import { registerDto } from '../interfaces/registerDto';
import { userDto } from '../interfaces/userDto';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  user: userDto | null = null;

  getToken(){
    return localStorage.getItem('Authorization');
  }
  setToken(token: string){
    return localStorage.setItem('Authorization', 'Bearer '+token);
  }
  removeToken(){
    return localStorage.removeItem('Authorization');
  }
  getUser():Observable<userDto>{
    return this.http.get<userDto>(backendUrlBase + 'user/getusername', {responseType: 'json'});
  }
  setUser(user: userDto){
    this.user = user;
  }
  removeUser(){
    this.user = null;
  }
  loginUser(userDto: loginDto){
    return this.http.post(backendUrlBase + 'user/login', userDto, {responseType: 'text'});
  }
  registerUser(userDto: registerDto){
    return this.http.post(backendUrlBase + 'user/register', userDto);
  }
}
