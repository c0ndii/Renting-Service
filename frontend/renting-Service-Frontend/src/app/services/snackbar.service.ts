import { Injectable } from '@angular/core';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }
  public openSnackbar(message: string, snackType?: any){
    const _snackType =
      snackType !== undefined ? snackType : 'Success';

    this.snackbar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: { message: message, snackType: _snackType }
    });
  }
  public dismissSnackbar(){
    this.snackbar.dismiss();
  }
}
