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
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { resetPasswordDto } from 'src/app/interfaces/resetPasswordDto';

@Component({
  selector: 'app-remind-password-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  templateUrl: './remind-password-dialog.component.html',
  styleUrl: './remind-password-dialog.component.scss',
})
export class RemindPasswordDialogComponent {
  disableMail: boolean;
  constructor(
    private snackbarService: SnackbarService,
    private authService: AuthService,
    public dialog: MatDialogRef<RemindPasswordDialogComponent>,
    private router: Router
  ) {
    this.disableMail = false;
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  resetCode = new FormControl('', [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(10),
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
  sendCode() {
    if (!this.email.errors) {
      this.authService.sendPasswordResetCode(this.email.value!).subscribe(
        (response) => {
          if (response === null) {
            this.snackbarService.openSnackbar('Kod został wysłany', 'Success');
            this.disableMail = true;
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
          switch (error.status) {
            case 401:
              this.errorMessage =
                'Konto nie istnieje lub poprzedni kod jest jeszcze ważny';
              this.status = 'Error';
              break;
            default:
              this.errorMessage = 'Nie można połączyć się z serwerem';
              this.status = 'Error';
              break;
          }
          this.snackbarService.openSnackbar(this.errorMessage, this.status);
        }
      );
    }
  }
  checkValidators: boolean = true;
  resetPasswordDto = {} as resetPasswordDto;
  resetPassword() {
    this.checkValidators =
      (this.email.hasError('required')
        ? true
        : this.email.hasError('email')
        ? true
        : false) ||
      (this.password.hasError('required')
        ? true
        : this.password.hasError('minlength')
        ? true
        : false) ||
      (this.passwordConfirm.hasError('required')
        ? true
        : this.passwordConfirm.hasError('passwordMismatch')
        ? true
        : false);
    if (this.checkValidators) {
    } else {
      this.resetPasswordDto.ResetToken = this.resetCode.value!;
      this.resetPasswordDto.Password = this.password.value!;
      this.resetPasswordDto.PasswordConfirm = this.passwordConfirm.value!;
      this.authService.resetPassword(this.resetPasswordDto).subscribe(
        (response) => {
          if (response === null) {
            this.snackbarService.openSnackbar(
              'Hasło zostało zmienione',
              'Success'
            );
          }
          this.dialog.close();
          this.router.navigate(['']);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
          switch (error.status) {
            case 404:
              this.errorMessage = 'Nieprawidłowy kod';
              this.status = 'Error';
              break;
            default:
              this.errorMessage = 'Nie można połączyć się z serwerem';
              this.status = 'Error';
              break;
          }
          this.snackbarService.openSnackbar(this.errorMessage, this.status);
        }
      );
    }
  }
}
