import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { userDto } from '../interfaces/userDto';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  selectedValue = new BehaviorSubject<string>('map');
  constructor(
    protected authService: AuthService,
    protected snackbar: SnackbarService,
    protected router: Router
  ) {}

  inputsDisabled: boolean = false;
  disableInputs() {
    this.inputsDisabled = true;
  }
  enableInputs() {
    this.inputsDisabled = false;
  }
  public set SelectedValue(selectedValue: string) {
    this.selectedValue.next(selectedValue);
  }
  public get SelectedValue(): Observable<string> {
    return this.selectedValue.asObservable();
  }

  logout() {
    this.authService.logout();
    this.snackbar.openSnackbar('Wylogowano', 'Info');
  }
  navigateToProfile() {
    this.router.navigate(['profile']);
  }
  navigateToCreateRentPost() {
    this.router.navigate(['addrentpost']);
  }
  navigateToCreateSalePost() {
    this.router.navigate(['addsalepost']);
  }
  navigateToMyPosts() {
    this.router.navigate(['myposts']);
  }
  navigateToFollowedPosts() {
    this.router.navigate(['followedposts']);
  }
  navigateToAdminPanel() {
    this.router.navigate(['admin/posts']);
  }
  navigateToMyComments() {
    this.router.navigate(['mycomments']);
  }
  navigateToReservations() {
    this.router.navigate(['myreservations']);
  }
}
