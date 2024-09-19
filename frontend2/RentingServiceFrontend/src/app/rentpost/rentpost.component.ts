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
import { SnackbarService } from '../services/snackbar.service';

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
  ],
  templateUrl: './rentpost.component.html',
  styleUrl: './rentpost.component.scss',
})
export class RentpostComponent implements OnInit, OnDestroy {
  pictures: Array<object> = [];
  postId?: number;
  post = new BehaviorSubject<forRentPostDto>({} as forRentPostDto);
  private mapLoaded = new BehaviorSubject<boolean>(false);
  private sub: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public gallery: Gallery,
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
