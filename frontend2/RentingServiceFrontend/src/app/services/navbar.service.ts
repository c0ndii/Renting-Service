import { Injectable} from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { userDto } from '../interfaces/userDto';

@Injectable({
  providedIn: 'root'
})
export class NavbarService{
  private username = new BehaviorSubject<string>('');
  private picture = new BehaviorSubject<string>('');
  private selectedValue = new BehaviorSubject<string>('map');
  constructor(protected authService: AuthService, protected snackbar: SnackbarService, protected router: Router) { 
  }
  
  inputsDisabled: boolean = false;
  search_value = '';
  disableInputs(){
    this.inputsDisabled = true;
  }
  enableInputs(){
    this.inputsDisabled = false;
  }
  isUserLoggedIn(): boolean{
    if(this.authService.getRole() != null){
      return true;
    }
    return false;
  }
  public UsernameOnReload(){
    if(this.isUserLoggedIn()){
      var username = this.authService.getUserName();
      if(username){
        this.username.next(username);
      }
    }
  }
  public PictureOnReload(){
    if(this.isUserLoggedIn()){
      var username = this.authService.getUserPicture();
      if(username){
        this.picture.next(username);
      }
    }
  }
  public set UserName(username: string) {
    this.username.next(username);
  }
  public get UserName() : Observable<string> {
    return this.username.asObservable();
  }
  public set SelectedValue(selectedValue: string) {
    this.selectedValue.next(selectedValue);
  }
  public get SelectedValue() : Observable<string> {
    return this.selectedValue.asObservable();
  }
  public set Picture(picture: string) {
    this.picture.next(picture);
  }
  public get Picture() : Observable<string> {
    return this.picture.asObservable();
  }
  logout(){
    this.authService.logout();
    this.snackbar.openSnackbar("Wylogowano", "Info");
  }
  profile(){
    this.router.navigate(['profile']);
  }
}