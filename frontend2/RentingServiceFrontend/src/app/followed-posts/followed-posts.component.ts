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

@Component({
  selector: 'app-followed-posts',
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
  ],
  templateUrl: './followed-posts.component.html',
  styleUrl: './followed-posts.component.scss',
})
export class FollowedPostsComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private navbar: NavbarService,
    private http: HttpClient,
    private snackbar: SnackbarService
  ) {}
  rentPosts = new BehaviorSubject<forRentPostDto[]>([]);
  salePosts = new BehaviorSubject<forSalePostDto[]>([]);
  selectedValue: string = 'rent';
  ngOnInit(): void {
    this.navbar.disableInputs();
    if (!this.authService.userLogged()) {
      this.router.navigate(['/login']);
    }
    this.preparePosts();
  }
  preparePosts() {
    this.getFollowedRentPosts().subscribe((response) => {
      this.rentPosts.next(response);
    });
    this.getFollowedSalePosts().subscribe((response) => {
      this.salePosts.next(response);
    });
  }
  getFollowedRentPosts(): Observable<forRentPostDto[]> {
    return this.http.get<forRentPostDto[]>(
      backendUrlBase + 'post/followedrentposts'
    );
  }
  getFollowedSalePosts(): Observable<forSalePostDto[]> {
    return this.http.get<forSalePostDto[]>(
      backendUrlBase + 'post/followedsaleposts'
    );
  }
  redirectToRentPost(postId: number) {
    this.router.navigate(['rentpost', postId]);
  }
  redirectToSalePost(postId: number) {
    this.router.navigate(['salepost', postId]);
  }
  followRentPost(postId: number) {
    let tmpList = this.rentPosts.value;
    this.http
      .get(backendUrlBase + 'post/togglerentfollow/' + postId)
      .pipe(
        map((result) => {
          if (result !== true) {
            tmpList = tmpList.filter((item) => item.postId !== postId);
            this.rentPosts.next(tmpList);
            this.snackbar.openSnackbar(
              'Post przestał być obserwowany',
              'success'
            );
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas usuwania posta z obserwowanych',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
  followSalePost(postId: number) {
    let tmpList = this.salePosts.value;
    this.http
      .get(backendUrlBase + 'post/togglerentfollow/' + postId)
      .pipe(
        map((result) => {
          if (result !== true) {
            tmpList = tmpList.filter((item) => item.postId !== postId);
            this.salePosts.next(tmpList);
            this.snackbar.openSnackbar(
              'Post przestał być obserwowany',
              'success'
            );
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas usuwania posta z obserwowanych',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
}
