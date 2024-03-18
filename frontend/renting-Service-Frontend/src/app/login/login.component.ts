import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { loginDto } from '../interfaces/loginDto';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
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
  selector: 'app-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService],
})
export class LoginComponent implements OnInit{
  constructor(private authService: AuthService, private navbar: NavbarService) {
    this.navbar.disableInputs();
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  loginDto = {} as loginDto;
  errorMessage = '';
  onSubmit = () => {
    if (this.emailFormControl.errors || this.passwordFormControl.errors) {
    } else {
      this.loginDto.email = this.emailFormControl.value!;
      this.loginDto.password = this.passwordFormControl.value!;
      // let token = this.authService.loginUser(this.loginDto);
      this.authService.loginUser(this.loginDto).subscribe((response) => {
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
