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
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { backendUrlBase } from '../../appsettings/constant';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-delete-account-dialog',
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
  templateUrl: './delete-account-dialog.component.html',
  styleUrl: './delete-account-dialog.component.scss',
})
export class DeleteAccountDialogComponent {
  constructor(
    private snackbarService: SnackbarService,
    private authService: AuthService,
    public dialog: MatDialogRef<DeleteAccountDialogComponent>,
    private http: HttpClient,
    private navbar: NavbarService
  ) {}

  errorMessage: string = '';
  status: string = '';

  deleteAccount() {
    this.http.delete(backendUrlBase + 'user/').subscribe(
      (response) => {
        if (response === null) {
          this.snackbarService.openSnackbar(
            'Konto zostało usunięte',
            'Success'
          );
          this.authService.logout();
        }
        this.dialog.close();
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.errorMessage = 'Nie można usunąć konta innego użytkownika';
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
