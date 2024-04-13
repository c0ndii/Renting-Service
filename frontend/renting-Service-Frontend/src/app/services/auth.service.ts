import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { backendUrlBase } from '../appsettings/constant';
import { loginDto } from '../interfaces/loginDto';
import { registerDto } from '../interfaces/registerDto';
import { userDto } from '../interfaces/userDto';
import { tokenDto } from '../interfaces/tokenDto';
import { refreshTokenDto } from '../interfaces/refreshTokenDto';
import { of, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { 
    
  }
  //JWT
  getJwtToken(){
    try{
      return localStorage.getItem('Authorization');
    } catch (error){
      return null;
    }
  }
  setJwtToken(token: string){
    return localStorage.setItem('Authorization', 'Bearer '+token);
  }
  removeJwtToken(){
    try{
      return localStorage.removeItem('Authorization');  
    } catch (error){
      return null;
    }
  }
  //REFRESH
  getRefreshToken(){
    try {
      return localStorage.getItem('RefreshToken');
    } catch (error){
      return null;
    }
  }
  setRefreshToken(token: string){
    return localStorage.setItem('RefreshToken', token);
  }
  removeRefreshToken(){
    try {
      return localStorage.removeItem('RefreshToken');
    } catch (error){
      return null;
    }
  }
  //USER
  getUserFetch():Observable<userDto>{
    return this.http.get<userDto>(backendUrlBase + 'user/getusername');
  }
  setUser(user: userDto){
    return localStorage.setItem('User', JSON.stringify(user));
  }
  removeUser(){
    try {
      return localStorage.removeItem('User');
    }
    catch (errror){
      return null;
    }
  }
  getUserFromLocalStorage(){
    try {
      var user = localStorage.getItem('User');
      if(user){
        return JSON.parse(user);
      }
    } catch (error){
      return null;
    }
  }
  //ROLE
  getRole() : string | null{
    var token = this.getJwtToken()?.split(" ", 2);
    var result = token && token[1];
    if(result){
      var decodedJwtRole = JSON.parse(window.atob(result.split('.')[1]))["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      return decodedJwtRole;
    }
    return null;
  }

  //AUTH
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
  login(token: tokenDto){
    this.setJwtToken(token.jwtToken);
    this.setRefreshToken(token.refreshToken);
    this.getUserFetch().subscribe(response => {
      this.setUser(response);
    });
  }
  logout(){
    this.removeJwtToken();
    this.removeRefreshToken();
    this.removeUser();
  }
}
