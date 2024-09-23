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

@Component({
  selector: 'app-reservation-dialog',
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
  ],
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.scss',
})
export class ReservationDialogComponent implements OnInit {
  postIdParam?: number;
  selectedDateRange?: { startDate: Dayjs; endDate: Dayjs };
  disabledDays: Date[] = [];
  postId = new BehaviorSubject<number>(0);
  myFilter = (d: Date | null): boolean => {
    return !this.disabledDays.find((item) => {
      return item.getTime() == d?.getTime();
    });
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    protected authService: AuthService,
    public dialog: MatDialogRef<ReservationDialogComponent>,
    private router: Router,
    private snackbar: SnackbarService
  ) {}
  ngOnInit(): void {
    this.getDisabledDatesFetch(this.postId.value).subscribe((res) => {
      this.getDisabledDays(res);
    });
  }

  getDisabledDatesFetch(postId: number): Observable<reservationDto[]> {
    return this.http.get<reservationDto[]>(
      backendUrlBase + 'reservation/post/' + postId
    );
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
}
