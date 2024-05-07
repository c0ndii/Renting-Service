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
  FormBuilder,
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
import { MatStepperModule } from '@angular/material/stepper';

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
    MatStepperModule,
  ],
  templateUrl: './remind-password-dialog.component.html',
  styleUrl: './remind-password-dialog.component.scss',
})
export class RemindPasswordDialogComponent {
  emailFormGroup = this.formBuilder.group({
    email: ['', Validators.email],
  });
  resetPasswordFormGroup = this.formBuilder.group({
    resetCode: [
      '',
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
    ],
    password: ['', Validators.required, Validators.minLength(8)],
    passwordConfirm: ['', Validators.required, this.passwordMatch.bind(this)],
  });
  constructor(
    private snackbarService: SnackbarService,
    private authService: AuthService,
    public dialog: MatDialogRef<RemindPasswordDialogComponent>,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = this.resetPasswordFormGroup.controls['password'].value!;
    const passwordConfirm = control.value;
    return password && passwordConfirm && password === passwordConfirm
      ? null
      : { passwordMismatch: true };
  }
  errorMessage: string = '';
  status: string = '';
  sendCode() {
    if (!this.emailFormGroup.errors) {
      this.authService
        .sendPasswordResetCode(this.emailFormGroup.controls['email'].value!)
        .subscribe(
          (response) => {
            if (response === null) {
              this.snackbarService.openSnackbar(
                'Kod został wysłany',
                'Success'
              );
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
  resetPasswordDto = {} as resetPasswordDto;
  resetPassword() {
    if (this.emailFormGroup.errors || this.resetPasswordFormGroup.errors) {
    } else {
      this.resetPasswordDto.ResetToken =
        this.resetPasswordFormGroup.controls['resetCode'].value!;
      this.resetPasswordDto.Password =
        this.resetPasswordFormGroup.controls['password'].value!;
      this.resetPasswordDto.PasswordConfirm =
        this.resetPasswordFormGroup.controls['passwordConfirm'].value!;
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
