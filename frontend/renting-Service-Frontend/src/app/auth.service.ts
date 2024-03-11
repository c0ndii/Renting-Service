import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private baseUrl: string = 'http://localhost';
  user: any = null;

  loadUser(){
    const request = this.http.get<any>(this.baseUrl + '/api/user/')
  }
}
