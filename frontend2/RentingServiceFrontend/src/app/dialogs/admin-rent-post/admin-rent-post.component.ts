import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { backendUrlBase } from '../../appsettings/constant';
import { NavbarService } from '../../services/navbar.service';
import { Gallery } from 'ng-gallery';
import { BehaviorSubject, Observable, map, catchError } from 'rxjs';
import { forRentPostDto } from '../../interfaces/forRentPostDto';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { CommonModule, NgFor } from '@angular/common';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-admin-rent-post',
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
    NgFor,
    NgImageSliderModule,
    MatIconModule,
    LeafletModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './admin-rent-post.component.html',
  styleUrl: './admin-rent-post.component.scss',
})
export class AdminRentPostComponent implements OnInit {
  pictures: Array<object> = [];
  postId?: number;
  post = new BehaviorSubject<forRentPostDto>({} as forRentPostDto);
  private mapLoaded = new BehaviorSubject<boolean>(false);
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public gallery: Gallery,
    public dialog: MatDialogRef<AdminRentPostComponent>,
    protected authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
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
