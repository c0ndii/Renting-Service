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
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { SnackbarService } from '../services/snackbar.service';
import { AdminRentPostComponent } from '../dialogs/admin-rent-post/admin-rent-post.component';
import { AdminSalePostComponent } from '../dialogs/admin-sale-post/admin-sale-post.component';

@Component({
  selector: 'app-admin-panel',
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
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  ngOnInit(): void {
    this.navbar.disableInputs();
    if (this.authService.getRole() !== 'Admin') {
      this.router.navigate(['']);
    }
    this.preparePosts();
  }
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

  preparePosts() {
    this.getUnconfirmedRentPosts().subscribe((response) => {
      this.rentPosts.next(response);
    });
    this.getUnconfirmedSalePosts().subscribe((response) => {
      this.salePosts.next(response);
    });
  }
  getUnconfirmedRentPosts(): Observable<forRentPostDto[]> {
    return this.http.get<forRentPostDto[]>(backendUrlBase + 'post/admin/rent');
  }
  getUnconfirmedSalePosts(): Observable<forSalePostDto[]> {
    return this.http.get<forSalePostDto[]>(backendUrlBase + 'post/admin/sale');
  }
  confirmRentPost(postId: number) {
    let tmpList = this.rentPosts.value;
    this.http
      .post(backendUrlBase + 'post/admin/confirm/' + postId, '')
      .pipe(
        map((result) => {
          if (result !== true) {
            tmpList = tmpList.filter((item) => item.postId !== postId);
            this.rentPosts.next(tmpList);
            this.snackbar.openSnackbar('Post został zatwierdzony', 'success');
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas zatwierdzania posta',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
  confirmSalePost(postId: number) {
    let tmpList = this.salePosts.value;
    this.http
      .post(backendUrlBase + 'post/admin/confirm/' + postId, '')
      .pipe(
        map((result) => {
          if (result !== true) {
            tmpList = tmpList.filter((item) => item.postId !== postId);
            this.salePosts.next(tmpList);
            this.snackbar.openSnackbar('Post został zatwierdzony', 'success');
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas zatwierdzania posta',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
  rejectRentPost(postId: number) {
    let tmpList = this.rentPosts.value;
    this.http
      .post(backendUrlBase + 'post/admin/delete/' + postId, '')
      .pipe(
        map((result) => {
          if (result !== true) {
            tmpList = tmpList.filter((item) => item.postId !== postId);
            this.rentPosts.next(tmpList);
            this.snackbar.openSnackbar('Post został usunięty', 'success');
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas usuwania posta',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
  rejectSalePost(postId: number) {
    let tmpList = this.salePosts.value;
    this.http
      .post(backendUrlBase + 'post/admin/delete/' + postId, '')
      .pipe(
        map((result) => {
          if (result !== true) {
            tmpList = tmpList.filter((item) => item.postId !== postId);
            this.salePosts.next(tmpList);
            this.snackbar.openSnackbar('Post został usunięty', 'success');
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas usuwania posta',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }

  openRentPostDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    postId: number
  ) {
    let dialogRef = this.dialog.open(AdminRentPostComponent, {
      width: 'auto',
      minHeight: '30vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.componentInstance.postId = postId;
  }

  openSalePostDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    postId: number
  ) {
    let dialogRef = this.dialog.open(AdminSalePostComponent, {
      width: 'auto',
      minHeight: '30vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.componentInstance.postId = postId;
  }
}
