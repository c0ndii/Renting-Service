import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forRentPostDto } from '../interfaces/forRentPostDto';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { CommonModule, NgFor } from '@angular/common';
import { userDto } from '../interfaces/userDto';
import { Gallery } from 'ng-gallery';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogComponent } from '../dialogs/reservation-dialog/reservation-dialog.component';
import {
  NgxDaterangepickerBootstrapDirective,
  NgxDaterangepickerBootstrapComponent,
} from 'ngx-daterangepicker-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { reservationDto } from '../interfaces/reservationDto';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReservationLongDialogComponent } from '../dialogs/reservation-long-dialog/reservation-long-dialog.component';

@Component({
  selector: 'app-rentpost',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgImageSliderModule,
    MatIconModule,
    LeafletModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule,
    NgxDaterangepickerBootstrapComponent,
    NgxDaterangepickerBootstrapDirective,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './rentpost.component.html',
  styleUrl: './rentpost.component.scss',
})
export class RentpostComponent implements OnInit, OnDestroy {
  pictures: Array<object> = [];
  tomorrow: Date = new Date(dayjs().add(1, 'day').toDate());
  postId?: number;
  selectedDateRange?: { startDate: Dayjs; endDate: Dayjs };
  disabledDays: Date[] = [];
  myFilter = (d: Date | null): boolean => {
    if (d! < this.tomorrow) {
      return false;
    }
    return !this.disabledDays.find((item) => {
      return item.getTime() == d?.getTime();
    });
  };
  post = new BehaviorSubject<forRentPostDto>({} as forRentPostDto);
  private mapLoaded = new BehaviorSubject<boolean>(false);
  private sub: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public gallery: Gallery,
    public dialog: MatDialog,
    protected authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.postId = +params['id'];
    });
    this.preparePostData();
    this.mapLoaded.subscribe((loaded) => {
      if (loaded) {
        this.post.asObservable().subscribe((data) => {
          this.map.setView(
            [+data.lat.replace(',', '.'), +data.lng.replace(',', '.')],
            16
          );
          let marker = new Leaflet.Marker(
            new Leaflet.LatLng(
              +data.lat.replace(',', '.'),
              +data.lng.replace(',', '.')
            )
          );
          marker.addTo(this.map);
        });
      }
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    zoomControl: false,
    center: new Leaflet.LatLng(52.13, 21.0),
  };

  readyUpMap(map: Leaflet.Map) {
    this.map = map;
    this.mapLoaded.next(true);
  }

  preparePostData() {
    this.getPostData().subscribe((response: forRentPostDto) => {
      if (response === undefined) {
        this.router.navigate(['']);
      }
      response.pictures.forEach((picture) => {
        this.pictures.push({
          image: 'data:image/png;base64,' + picture,
          thumbImage: 'data:image/png;base64,' + picture,
        });
      });
      if (
        !response.confirmed &&
        (this.authService.user.value.userId !== response.user.userId ||
          this.authService.getRole() !== 'Admin')
      ) {
        this.router.navigate(['']);
      }
      this.post.next(response);
    });
  }
  getPostData(): Observable<forRentPostDto> {
    return this.http.get<forRentPostDto>(
      backendUrlBase + 'post/rentpost/' + this.postId
    );
  }
  editPost(postId: number) {
    this.router.navigate(['myposts/rentpost', postId]);
  }
  deletePost(postId: number) {
    this.http.delete(backendUrlBase + 'post/' + postId).subscribe(() => {
      this.router.navigate(['myposts']);
    });
  }
  followPost(postId: number) {
    this.http
      .get(backendUrlBase + 'post/togglefollow/' + postId)
      .pipe(
        map((result) => {
          if (result !== true) {
            this.post.value.isFollowedByUser = false;
            this.snackbar.openSnackbar(
              'Post przestał być obserwowany',
              'success'
            );
          } else {
            this.post.value.isFollowedByUser = true;
            this.snackbar.openSnackbar('Post został zaobserwowany', 'success');
          }
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas próby obserwacji posta',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }
  deleteComment(commentId: number) {
    this.http
      .delete(backendUrlBase + 'comment/' + commentId)
      .pipe(
        map(() => {
          let tmpPost = this.post.value;
          tmpPost.comments = tmpPost.comments.filter(
            (item) => item.commentId !== commentId
          );
          this.post.next(tmpPost);
          this.snackbar.openSnackbar('Komentarz został usunięty', 'success');
        }),
        catchError(() => {
          this.snackbar.openSnackbar(
            'Wystąpił błąd podczas próby usunięcia komentarza',
            'error'
          );
          throw new Error();
        })
      )
      .subscribe();
  }

  openDialog() {
    console.log(this.post.value.mainCategory);
    if (this.post.value.mainCategory !== 'Wypoczynek') {
      this.openRentPostDialog(
        '300ms',
        '150ms',
        this.post.value.postId,
        this.post.value.price
      );
    } else {
      this.openRentPostDialogLong(
        '300ms',
        '150ms',
        this.post.value.postId,
        this.post.value.price
      );
    }
  }

  openRentPostDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    postId: number,
    price: number
  ) {
    let dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '40vw',
      minHeight: '20vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.componentInstance.postId.next(postId);
    dialogRef.componentInstance.price.next(price);
  }

  openRentPostDialogLong(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    postId: number,
    price: number
  ) {
    let dialogRef = this.dialog.open(ReservationLongDialogComponent, {
      width: '40vw',
      minHeight: '20vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.componentInstance.postId.next(postId);
    dialogRef.componentInstance.price.next(price);
  }
}

export const getLayers = (): Leaflet.Layer[] => {
  return [
    new Leaflet.TileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      } as Leaflet.TileLayerOptions
    ),
  ] as Leaflet.Layer[];
};
