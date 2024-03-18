import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendUrlBase } from '../appsettings/constant';
import { loginDto } from '../interfaces/loginDto';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  user: any = null;

  getToken(){
    return localStorage.getItem('Authorization');
  }
  setToken(token: string){
    return localStorage.setItem('Authorization', 'Bearer '+token);
  }
  removeToken(){
    return localStorage.removeItem('Authorization');
  }
  loginUser(userDto: loginDto):Observable<boolean> {
    this.http.post(backendUrlBase + 'user/login', userDto, {responseType: 'text'}).subscribe(token => {
      if(token){
        this.setToken(token);
        return true;
      }
        return false;
    });
    return of(false);
  }

}
