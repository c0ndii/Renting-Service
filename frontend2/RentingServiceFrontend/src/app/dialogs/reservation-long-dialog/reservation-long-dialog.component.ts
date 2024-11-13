import { Component, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule, formatDate } from '@angular/common';
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
import { MatCardModule } from '@angular/material/card';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { backendUrlBase } from '../../appsettings/constant';
import { NavbarService } from '../../services/navbar.service';
import { Gallery } from 'ng-gallery';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  NgxDaterangepickerBootstrapDirective,
  NgxDaterangepickerBootstrapComponent,
} from 'ngx-daterangepicker-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import { reservationDto } from '../../interfaces/reservationDto';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { createReservationDto } from '../../interfaces/createReservationDto';

@Component({
  selector: 'app-reservation-long-dialog',
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
    CommonModule,
    NgxDaterangepickerBootstrapComponent,
    NgxDaterangepickerBootstrapDirective,
    FullCalendarModule,
    MatDatepickerModule,
    MatCardModule,
  ],
  templateUrl: './reservation-long-dialog.component.html',
  styleUrl: './reservation-long-dialog.component.scss',
})
export class ReservationLongDialogComponent implements OnInit {
  postIdParam?: number;
  totalPrice = new BehaviorSubject<number>(0);
  postId = new BehaviorSubject<number>(0);
  price = new BehaviorSubject<number>(0);
  disabledDays: Date[] = [];
  disabledDaysSecond: Date[] = [];
  selectedRange: Date[] = [];
  startDate: Date | null = null;
  stopDate: Date | null = null;
  reservations: reservationDto[] = [];
  myFilter = (d: Date | null): boolean => {
    return !this.disabledDays.find((item) => {
      return item.getTime() == d?.getTime();
    });
  };
  myFilterSecond = (d: Date | null): boolean => {
    return !this.disabledDaysSecond.find((item) => {
      return item.getTime() == d?.getTime();
    });
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    protected authService: AuthService,
    public dialog: MatDialogRef<ReservationLongDialogComponent>,
    private router: Router,
    private snackbar: SnackbarService
  ) {}
  ngOnInit(): void {
    this.disableBeforeDates();
    this.getDisabledDatesFetch(this.postId.value).subscribe((res) => {
      this.getDisabledDays(res);
      this.reservations = res;
    });
  }

  getDisabledDatesFetch(postId: number): Observable<reservationDto[]> {
    return this.http.get<reservationDto[]>(
      backendUrlBase + 'reservation/post/' + postId
    );
  }

  disableBeforeDates() {
    let startDate = dayjs().startOf('year').add(-10, 'year');
    let currentDate = dayjs().startOf('day');
    while (startDate.isBefore(currentDate)) {
      this.disabledDays?.push(startDate.toDate());
      startDate = startDate.add(1, 'day');
    }
  }

  disableBeforeDatesSecond() {
    this.disabledDaysSecond = [];
    let startDate = dayjs().startOf('year').add(-10, 'year');
    let checkedDate = dayjs(this.startDate);
    while (startDate.isBefore(checkedDate)) {
      this.disabledDaysSecond?.push(startDate.toDate());
      startDate = startDate.add(1, 'day');
    }
  }

  getDisabledDays(excludeDates: reservationDto[]) {
    excludeDates.forEach((element) => {
      let startDate = dayjs(element.fromDate).add(-1, 'day');
      let endDate = dayjs(element.toDate).add(2, 'day');
      while (startDate.isBefore(endDate)) {
        this.disabledDays?.push(startDate.toDate());
        startDate = startDate.add(1, 'day');
      }
    });
  }

  getDisabledDaysSecond(excludeDates: reservationDto[]) {
    excludeDates.forEach((element) => {
      let checkedDate = dayjs(this.startDate);
      let startDate = dayjs(element.fromDate).add(-1, 'day');
      if (checkedDate.isBefore(startDate)) {
        let lastDayOfYear = dayjs().endOf('year').add(10, 'year');
        while (startDate.isBefore(lastDayOfYear)) {
          this.disabledDaysSecond?.push(startDate.toDate());
          startDate = startDate.add(1, 'day');
        }
        return;
      }
    });
  }

  updateSecondPicker() {
    this.disableBeforeDatesSecond();
    this.getDisabledDaysSecond(this.reservations);
  }

  checkedDate() {
    this.selectedRange = [];
    let startDate = dayjs(this.startDate);
    let endDate = dayjs(this.stopDate);
    while (startDate.isBefore(endDate)) {
      this.selectedRange?.push(startDate.toDate());
      startDate = startDate.add(1, 'day');
    }
    let multipler = this.selectedRange.length;
    this.totalPrice.next(multipler * this.price.value);
  }

  reserve() {
    if (this.startDate !== null && this.stopDate !== null) {
      let reservation = {} as createReservationDto;
      reservation.FromDate = this.startDate;
      reservation.ToDate = this.stopDate;
      this.http
        .post(backendUrlBase + 'reservation/' + this.postId.value, reservation)
        .subscribe(
          (response) => {
            if (response === null) {
              this.dialog.close();
              this.snackbar.openSnackbar('Utworzono rezerwację', 'Success');
            }
          },
          (error: HttpErrorResponse) => {
            this.snackbar.openSnackbar(
              'Wystąpił błąd, zaleca się odświeżenie strony',
              'error'
            );
          }
        );
    }
  }

  cancel() {
    this.dialog.close();
  }
}
