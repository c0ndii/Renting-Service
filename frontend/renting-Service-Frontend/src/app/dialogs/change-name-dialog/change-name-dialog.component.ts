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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { backendUrlBase } from 'src/app/appsettings/constant';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-change-name-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule, ],
  templateUrl: './change-name-dialog.component.html',
  styleUrl: './change-name-dialog.component.scss'
})
export class ChangeNameDialogComponent {
  constructor(private snackbarService: SnackbarService, private authService: AuthService, public dialog: MatDialogRef<ChangeNameDialogComponent>, private http: HttpClient, private navbar: NavbarService) {
    
  }
  name = new FormControl('', [
    Validators.required,
  ]);
  errorMessage: string = '';
  status: string = '';
  changeName = () => {
    this.http.patch(backendUrlBase + 'user/editname/'+this.name.value,null).subscribe((response) => {
      if(response === null){
        this.snackbarService.openSnackbar("Imię zostało zmienione", "Success");
        this.authService.changeName(this.name.value!);
        this.navbar.UserName = this.name.value!;
      }
      this.dialog.close();
    }, (error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          this.errorMessage = 'Nie można zmienić imienia innego użytkownika';
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
