import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavbarService } from '../services/navbar.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { commentDto } from '../interfaces/commentDto';
import { reservationDto } from '../interfaces/reservationDto';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReservationFlagPipe } from '../pipes/reservation-flag.pipe';
import { CreateCommentDialogComponent } from '../dialogs/create-comment-dialog/create-comment-dialog.component';

@Component({
  selector: 'app-user-reservations',
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
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ReservationFlagPipe,
  ],
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss',
})
export class UserReservationsComponent implements OnInit {
  myReservations = new BehaviorSubject<reservationDto[]>([]);
  toMeReservations = new BehaviorSubject<reservationDto[]>([]);

  myFiltered = new BehaviorSubject<reservationDto[]>([]);
  toMeFiltered = new BehaviorSubject<reservationDto[]>([]);

  selectedValue: string = 'my';
  private readonly _formBuilder = inject(FormBuilder);

  readonly toppings = this._formBuilder.group({
    created: true,
    confirmed: true,
    completed: true,
  });

  constructor(
    public dialog: MatDialog,
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
    this.getMyReservations();
    this.getToMeReservations();
    this.toMeReservations.subscribe((res) => {
      this.toMeFiltered.next(res);
    });
    this.myReservations.subscribe((res) => {
      this.myFiltered.next(res);
    });
  }

  changeFilters() {
    this.myFiltered.next(this.myReservations.value);
    this.toMeFiltered.next(this.toMeReservations.value);
    if (this.selectedValue === 'my') {
      this.myFiltered.next(
        this.myFiltered.value.filter(
          (x) =>
            (x.reservationFlag === 0 && this.toppings.value.created) ||
            (x.reservationFlag === 1 && this.toppings.value.confirmed) ||
            (x.reservationFlag === 3 && this.toppings.value.completed)
        )
      );
    } else {
      this.toMeFiltered.next(
        this.toMeFiltered.value.filter(
          (x) =>
            (x.reservationFlag === 0 && this.toppings.value.created) ||
            (x.reservationFlag === 1 && this.toppings.value.confirmed) ||
            (x.reservationFlag === 3 && this.toppings.value.completed)
        )
      );
    }
  }

  getMyReservations() {
    this.http
      .get<reservationDto[]>(backendUrlBase + 'reservation/user')
      .subscribe((response) => {
        this.myReservations.next(response);
      });
  }

  getToMeReservations() {
    this.http
      .get<reservationDto[]>(backendUrlBase + 'reservation/owned')
      .subscribe((response) => {
        this.toMeReservations.next(response);
      });
  }

  cancelReservation(reservation: number) {
    let tmpList = {} as reservationDto[];
    if (this.selectedValue === 'toMe') {
      tmpList = this.toMeReservations.value;
    } else {
      tmpList = this.myReservations.value;
    }
    this.http
      .put(backendUrlBase + 'reservation/cancel/' + reservation, '')
      .pipe(
        map(() => {
          tmpList = tmpList.filter((e) => e.reservationId !== reservation);
          if (this.selectedValue === 'toMe') {
            this.toMeReservations.next(tmpList);
          } else {
            this.myReservations.next(tmpList);
          }

          this.snackbar.openSnackbar('Rezerwacja została anulowana', 'success');
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Rezerwacje anulować można ponad 2 dni przed okresem wynajmu',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }

  confirmReservation(reservation: number) {
    let tmpList = this.toMeReservations.value;
    this.http
      .put(backendUrlBase + 'reservation/confirm/' + reservation, '')
      .pipe(
        map(() => {
          tmpList = tmpList
            .filter((e) => e)
            .map((e) => {
              if (e.reservationFlag == 0) {
                let tmp = {} as reservationDto;
                tmp.fromDate = e.fromDate;
                tmp.toDate = e.toDate;
                tmp.reservationFlag = 1;
                tmp.postId = e.postId;
                tmp.reservationId = e.reservationId;
                tmp.userId = e.userId;
                return tmp;
              }
              return e;
            });
          this.toMeReservations.next(tmpList);
          this.snackbar.openSnackbar(
            'Rezerwacja została potwierdzona',
            'success'
          );
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Brak wystarczających uprawnień do zaakceptowania rezerwacji',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }

  completeReservation(reservation: number) {
    let tmpList = this.toMeReservations.value;
    this.http
      .put(backendUrlBase + 'reservation/complete/' + reservation, '')
      .pipe(
        map(() => {
          tmpList = tmpList
            .filter((e) => e)
            .map((e) => {
              if (e.reservationFlag == 0) {
                let tmp = {} as reservationDto;
                tmp.fromDate = e.fromDate;
                tmp.toDate = e.toDate;
                tmp.reservationFlag = 3;
                tmp.postId = e.postId;
                tmp.reservationId = e.reservationId;
                tmp.userId = e.userId;
                return tmp;
              }
              return e;
            });
          this.toMeReservations.next(tmpList);
          this.snackbar.openSnackbar(
            'Rezerwacja została zakończona',
            'success'
          );
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Brak wystarczających uprawnień do zakończenia rezerwacji',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }

  createComment(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    postId: number
  ) {
    let dialogRef = this.dialog.open(CreateCommentDialogComponent, {
      width: '30vw',
      minHeight: '30vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.componentInstance.postId.next(postId);
  }

  canUserComment(postId: number) {
    this.http
      .get<boolean>(backendUrlBase + 'reservation/comment/' + postId)
      .subscribe((result) => {
        return result;
      });
  }

  redirectToRentPost(postId: number) {
    this.router.navigate(['rentpost', postId]);
  }
}
