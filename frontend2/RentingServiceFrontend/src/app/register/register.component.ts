import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { registerDto } from '../interfaces/registerDto';
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
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarService } from '../services/navbar.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VerifyAccountDialogComponent } from '../dialogs/verify-account-dialog/verify-account-dialog.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  name = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
    Validators.pattern('^[a-zA-Z]*$'),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  passwordConfirm = new FormControl('', [
    Validators.required,
    this.passwordMatch.bind(this),
  ]);

  constructor(
    private authService: AuthService,
    private navbar: NavbarService,
    private router: Router,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
  ) {
    this.navbar.disableInputs();
  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string){
    this.dialog.open(VerifyAccountDialogComponent, {
      width: '400px',
      minHeight: '300px',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }
  passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = this.password.value;
    const passwordConfirm = control.value;
    return password && passwordConfirm && password === passwordConfirm
      ? null
      : { passwordMismatch: true };
  }

  clearInputs(){
    this.name.reset();
    this.email.reset();
    this.password.reset();
    this.passwordConfirm.reset();
  }

  checkValidators: boolean = true;
  registerDto = {} as registerDto;
  errorMessage = '';
  status = '';
  onSubmit = () => {
    this.checkValidators =
      (this.name.hasError('required')
        ? true
        : this.name.hasError('pattern')
        ? true
        : false) ||
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
      this.registerDto.Name = this.name.value!;
      this.registerDto.Email = this.email.value!;
      this.registerDto.Password = this.password.value!;
      this.registerDto.Confirmpassword = this.passwordConfirm.value!;
      this.authService.registerUser(this.registerDto).subscribe(
        (response) => {
          if (response === null) {
            this.clearInputs();
            this.openDialog('300ms','150ms');
            this.snackbarService.openSnackbar('Utworzono konto', 'Success');
          }
        },
        (error: HttpErrorResponse) => {
          switch (error.status) {
            case 409:
              this.errorMessage = 'Email jest zajęty';
              this.status = 'Info';
              break;
            case 500:
              this.errorMessage = 'Wewnętrzny błąd serwera';
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
  };
  ngOnInit(): void {
    if (this.authService.getJwtToken() !== null) {
      this.router.navigate(['']);
    }
  }
  ngOnDestroy(): void {}
}