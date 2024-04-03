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
import { json } from 'stream/consumers';

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
  name = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
    Validators.pattern('^[a-zA-Z]*$'),
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  passwordConfirm = new FormControl('', [
    Validators.required,
    this.passwordMatch.bind(this),
  ]);

  constructor(private authService: AuthService, private navbar: NavbarService, private router: Router) {
    this.navbar.disableInputs();
  }
  passwordMatch(control: AbstractControl) : ValidationErrors | null{
    const password = this.password.value;
    const passwordConfirm = control.value;
    return password && passwordConfirm && password === passwordConfirm ?
    null : { passwordMismatch: true };
  }

  checkValidators: boolean = true;
  registerDto = {} as registerDto;
  errorMessage = '';
  onSubmit = () => {
    this.checkValidators = 
    (this.name.hasError('required') ? true : (this.name.hasError('pattern') ? true : false))
    || (this.email.hasError('required') ? true : (this.email.hasError('email') ? true : false))
    || (this.password.hasError('required') ? true : (this.password.hasError('minlength') ? true : false))
    || (this.passwordConfirm.hasError('required') ? true : (this.passwordConfirm.hasError('passwordMismatch') ? true : false))
    
    if (this.checkValidators) {
    } else {
      this.registerDto.Name = this.name.value!;
      this.registerDto.Email = this.email.value!;
      this.registerDto.Password = this.password.value!;
      this.registerDto.Confirmpassword = this.passwordConfirm.value!;
      this.authService.registerUser(this.registerDto).subscribe((response) => {
        console.log(response);
        if (response === null) {
          console.log("sukces");
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
