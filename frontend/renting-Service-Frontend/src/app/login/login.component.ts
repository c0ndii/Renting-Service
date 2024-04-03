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
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarService } from '../services/navbar.service';
import { Router } from '@angular/router';

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
  constructor(private authService: AuthService, private navbar: NavbarService, private router: Router) {
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
      this.loginDto.Email = this.emailFormControl.value!;
      this.loginDto.Password = this.passwordFormControl.value!;
      // let token = this.authService.loginUser(this.loginDto);
      this.authService.loginUser(this.loginDto).subscribe((response) => {
        if (response) {
          this.router.navigate(['']);
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
