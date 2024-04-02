import { Component, Directive, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { registerDto } from '../interfaces/registerDto';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  NG_VALIDATORS,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
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

export const passwordMatch: ValidatorFn = (control: AbstractControl) : ValidationErrors | null => {
  const password = control.get('password')?.value;
  const passwordConfirm = control.get('passwordConfirm')?.value;
  if (password && passwordConfirm && password != passwordConfirm) {
    return { passwordMismatch: true };
  }
  return null;
}

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
  imports: [NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    RouterModule],
    providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(private authService: AuthService, private navbar: NavbarService) {
    this.navbar.disableInputs();
    this.form = new FormGroup(
      {
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z]*$'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
      ]),
    },
    {
      validators: passwordMatch,
    }
    );
  }

  checkValidators: boolean = true;
  matcher = new MyErrorStateMatcher();
  registerDto = {} as registerDto;
  errorMessage = '';
  onSubmit = () => {
    this.checkValidators = 
    (this.form.get('name')?.hasError('required') ? true : (this.form.get('name')?.hasError('pattern') ? true : false))
    || (this.form.get('email')?.hasError('required') ? true : (this.form.get('email')?.hasError('email') ? true : false))
    || (this.form.get('password')?.hasError('required') ? true : (this.form.get('password')?.hasError('minlength') ? true : false))
    || (this.form.get('passwordConfirm')?.hasError('required') ? true : (this.form.errors?.['passwordMismatch'] ? true : false))
    
    console.log((this.form.errors?.['passwordMismatch']));
    if (this.checkValidators) {
    } else {
      this.registerDto.name = this.form.get('name')!.value;
      this.registerDto.email = this.form.get('email')!.value;
      this.registerDto.password = this.form.get('password')!.value;
      this.registerDto.confirmpassword = this.form.get('passwordConfirm')!.value;
      // let token = this.authService.loginUser(this.loginDto);
      this.authService.loginUser(this.registerDto).subscribe((response) => {
        if (response) {
          window.location.reload();
        } else {
          this.errorMessage = 'Niepoprawne dane logowania';
        }
      });
    }
  };
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
}
