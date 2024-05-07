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
} from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-verify-account-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule, ],
  templateUrl: './verify-account-dialog.component.html',
  styleUrl: './verify-account-dialog.component.scss'
})
export class VerifyAccountDialogComponent {
  constructor(private snackbarService: SnackbarService, private authService: AuthService, public dialog: MatDialogRef<VerifyAccountDialogComponent>, private router: Router ) {
    
  }
  codeFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(8),
    Validators.minLength(8),
  ]);
  errorMessage: string = '';
  status: string = '';
  sendCode(){
    if(!this.codeFormControl.errors){
      this.authService.verifyAccount(this.codeFormControl.value!).subscribe((response) => {
        if(response === null){
          this.snackbarService.openSnackbar("Konto zostało zweryfikowane", "Success");
        }
        this.dialog.close();
        this.router.navigate(['login']);
      }, (error: HttpErrorResponse) => {
        console.log(error.status);
        switch (error.status) {
          case 404:
            this.errorMessage = 'Konto zostało już potwierdzone bądź podano błędny kod';
            this.status = 'Error';
            break;
          default:
            this.errorMessage = 'Nie można połączyć się z serwerem';
            this.status = 'Error';
            break;
        }
        this.snackbarService.openSnackbar(this.errorMessage,this.status);
      })
    }
  }
}
