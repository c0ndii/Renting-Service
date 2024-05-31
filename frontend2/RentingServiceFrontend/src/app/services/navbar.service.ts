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
  public set SelectedValue(selectedValue: string) {
    this.selectedValue.next(selectedValue);
  }
  public get SelectedValue() : Observable<string> {
    return this.selectedValue.asObservable();
  }
  
  logout(){
    this.authService.logout();
    this.snackbar.openSnackbar("Wylogowano", "Info");
  }
  profile(){
    this.router.navigate(['profile']);
  }
}