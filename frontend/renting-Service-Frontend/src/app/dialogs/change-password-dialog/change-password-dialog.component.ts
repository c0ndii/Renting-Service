import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { backendUrlBase } from 'src/app/appsettings/constant';
import { NavbarService } from 'src/app/services/navbar.service';
import { changePasswordDto } from 'src/app/interfaces/changePasswordDto';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule, ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss'
})
export class ChangePasswordDialogComponent {
  constructor(private snackbarService: SnackbarService, private authService: AuthService, public dialog: MatDialogRef<changePasswordDto>, private http: HttpClient, private navbar: NavbarService) {
    
  }
  oldpassword = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  passwordConfirm = new FormControl('', [
    Validators.required,
    this.passwordMatch.bind(this),
  ]);
  passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = this.password.value;
    const passwordConfirm = control.value;
    return password && passwordConfirm && password === passwordConfirm
      ? null
      : { passwordMismatch: true };
  }
  errorMessage: string = '';
  status: string = '';
  changePasswordto = {} as changePasswordDto;
  changePassword = () => {
    if(!(this.oldpassword.errors || this.password.errors || this.passwordConfirm.errors)){
      this.changePasswordto.OldPassword = this.oldpassword.value!;
      this.changePasswordto.NewPassword = this.password.value!;
      this.changePasswordto.ConfirmNewPassword = this.passwordConfirm.value!;
      this.http.patch(backendUrlBase + 'auth/changepassword/',this.changePasswordto).subscribe((response) => {
        if(response === null){
          this.snackbarService.openSnackbar("Hasło zostało zmienione, zaloguj się ponownie", "Success");
          this.authService.logout();
        }
        this.dialog.close();
      }, (error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.errorMessage = 'Nie można zmienić hasła innego użytkownika';
            this.status = 'Error';
            break;
          default:
            this.errorMessage = 'Nie można połączyć się z serwerem';
            this.status = 'Error';
            break;
        }
        this.snackbarService.openSnackbar(this.errorMessage,this.status);
      });
    }
    
  }
}
