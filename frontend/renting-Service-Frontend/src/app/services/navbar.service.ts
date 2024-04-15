import { Injectable} from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService{
  private username = new BehaviorSubject<string>('');
  constructor(protected authService: AuthService) { 
  }
  selectedValue = "map";
  inputsDisabled: boolean = false;
  search_value = '';
  disableInputs(){
    this.inputsDisabled = true;
  }
  enableInputs(){
    this.inputsDisabled = false;
  }
  changeType()
  {
    console.log(this.selectedValue);
    console.log(this.inputsDisabled);
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
  public set UserName(username: string) {
    this.username.next(username);
  };
  public get UserName() : Observable<string> {
    return this.username.asObservable();
  }
}
