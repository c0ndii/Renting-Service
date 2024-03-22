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
  FormGroup,
  AbstractControl,
  ValidationErrors,
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
  constructor(private authService: AuthService, private navbar: NavbarService) {
    this.navbar.disableInputs();
  }
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
    Validators.pattern('^[a-zA-Z]*$'),
  ])
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  passwordConfirmFormControl = new FormControl('', [
    Validators.required,
  ]);
  matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.passwordFormControl.root.value;
    const passwordConfirm = this.passwordConfirmFormControl.root.value;
    return password === passwordConfirm ? null : { matchedPasswords: true}
  }
  matcher = new MyErrorStateMatcher();
  registerDto = {} as registerDto;
  errorMessage = '';
  onSubmit = () => {
    if (this.emailFormControl.errors || this.passwordFormControl.errors || this.nameFormControl.errors || this.passwordConfirmFormControl.errors) {
    } else {
      this.registerDto.name = this.nameFormControl.value!;
      this.registerDto.email = this.emailFormControl.value!;
      this.registerDto.password = this.passwordFormControl.value!;
      this.registerDto.confirmpassword = this.passwordConfirmFormControl.value!;
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
