import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
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
import { BehaviorSubject } from 'rxjs';
import { createCommentDto } from '../../interfaces/createCommentDto';

@Component({
  selector: 'app-create-comment-dialog',
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
  templateUrl: './create-comment-dialog.component.html',
  styleUrl: './create-comment-dialog.component.scss',
})
export class CreateCommentDialogComponent {
  constructor(
    private snackbarService: SnackbarService,
    private authService: AuthService,
    public dialog: MatDialogRef<CreateCommentDialogComponent>,
    private http: HttpClient,
    protected router: Router,
    private navbar: NavbarService
  ) {}
  postId = new BehaviorSubject<number>(0);
  name = new FormControl('', [Validators.required]);
  errorMessage: string = '';
  status: string = '';

  redirectToRentPost(postId: number) {
    this.router.navigate(['rentpost', postId]);
  }
  createComment = () => {
    if (!this.name.errors) {
      let tmp = {} as createCommentDto;
      tmp.CommentText = this.name.value!;
      this.http
        .post(backendUrlBase + 'comment/' + this.postId.value, tmp)
        .subscribe(
          (response) => {
            if (response === null) {
              this.snackbarService.openSnackbar(
                'Komentarz został dodany',
                'Success'
              );
            }
            this.dialog.close();
            this.redirectToRentPost(this.postId.value);
          },
          (error: HttpErrorResponse) => {
            switch (error.status) {
              case 401:
                this.errorMessage = 'Niezalogowany użytkownik';
                this.status = 'Error';
                break;
              case 403:
                this.errorMessage = 'Brak uprawnień do zasobu';
                this.status = 'Error';
                break;
              case 400:
                this.errorMessage =
                  'Komentarz do tego posta został już napisany';
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
}
