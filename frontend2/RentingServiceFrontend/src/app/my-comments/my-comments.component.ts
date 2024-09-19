import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavbarService } from '../services/navbar.service';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forRentPostDto } from '../interfaces/forRentPostDto';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { SnackbarService } from '../services/snackbar.service';
import { postDto } from '../interfaces/postDto';
import { SidenavbarService } from '../services/sidenavbar.service';
import { postQuery } from '../interfaces/postQuery';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { pageResult } from '../interfaces/pageResult';
import { ReactiveFormsModule } from '@angular/forms';
import { commentDto } from '../interfaces/commentDto';

@Component({
  selector: 'app-my-comments',
  standalone: true,
  imports: [
    NgFor,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    CommonModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './my-comments.component.html',
  styleUrl: './my-comments.component.scss',
})
export class MyCommentsComponent implements OnInit {
  comments = new BehaviorSubject<commentDto[]>([]);

  constructor(
    protected navbar: NavbarService,
    protected authService: AuthService,
    protected router: Router,
    private http: HttpClient,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.navbar.disableInputs();
    if (!this.authService.userLogged()) {
      this.router.navigate(['/login']);
    }
    this.getComments();
  }

  getComments() {
    this.http
      .get<commentDto[]>(backendUrlBase + 'comment')
      .subscribe((response) => {
        console.log(response);
        this.comments.next(response);
      });
  }

  deleteComment(commentId: number) {
    let tmpList = this.comments.value;
    this.http
      .delete(backendUrlBase + 'comment/' + commentId)
      .pipe(
        map(() => {
          tmpList = tmpList.filter((item) => item.commentId !== commentId);
          this.comments.next(tmpList);
          this.snackbar.openSnackbar('Komentarz został usunięty', 'success');
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas usuwania komentarza',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
  redirectToRentPost(postId: number) {
    this.router.navigate(['rentpost', postId]);
  }
}
