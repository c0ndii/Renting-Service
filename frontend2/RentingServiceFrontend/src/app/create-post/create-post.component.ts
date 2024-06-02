import { Component } from '@angular/core';
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
import { SnackbarService } from '../services/snackbar.service';
import { AuthService } from '../services/auth.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { backendUrlBase } from '../appsettings/constant';
import { getLayers } from '../map-layout/map-layout.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { createForRentPostDto } from '../interfaces/createForRentPostDto';
import { Observable, firstValueFrom, lastValueFrom, take, forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonToggleModule,
    CommonModule,
    MatSelectModule,
    LeafletModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent {
  topImages: string[] = [];
  bottomImages: string[] = [];
  postDto = {} as createForRentPostDto;
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      transferArrayItem(
        event.container.data,
        event.previousContainer.data,
        event.currentIndex + 1,
        event.previousIndex
      );
    }
  }
  constructor(
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.http
      .get<string[]>(backendUrlBase + 'maincategory/rent')
      .subscribe((res) => {
        this.mainRentCategories = res;
      });
      this.selectedRentMainCategory = 'Mieszkanie'
  }
  mapSerachProvider = new OpenStreetMapProvider();
  title = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]);
  description = new FormControl('', [
    Validators.required,
    Validators.maxLength(500)
    , Validators.minLength(20)
  ]);
  mainCategory = new FormControl('', [Validators.required]);
  sleepingPlaceCount = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  price = new FormControl('', [Validators.required, Validators.min(1)]);
  features = new FormControl('', [Validators.required]);
  categories = new FormControl('', [Validators.required]);
  checkPostType(): boolean {
    if (this.selectedValue == 'rent') {
      return true;
    }
    return false;
  }
  readyUpMap(map: Leaflet.Map) {
    this.map = map;
    this.map.addControl(Leaflet.control.zoom({ position: 'bottomright' }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setGeoLocation.bind(this));
    }
    var searchBar = GeoSearch.GeoSearchControl({
      provider: this.mapSerachProvider,

      style: 'button',
      position: 'topright',
      autoComplete: true,
      autoCompleteDelay: 250,
      searchLabel: 'Wpisz adres',
    });
    this.map.addControl(searchBar);
  }
  setGeoLocation(position: { coords: { latitude: any; longitude: any } }) {
    const {
      coords: { latitude, longitude },
    } = position;

    this.map.setView([latitude, longitude], 15);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors',
    }).addTo(this.map);
  }
  mainRentCategories: string[] = [];
  selectedRentMainCategory: string = '';
  selectedValue: string = 'rent';
  errorMessage: string = '';
  status: string = '';
  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    zoomControl: false,
    center: new Leaflet.LatLng(52.13, 21.0),
  };
  picture = new FormControl('', [Validators.required]);
  data = new FormData();
  async handleFileInput(event: any) {
    let j = 0;
    for (let i = 0; i < 6; i++) {
      const reader = new FileReader();
      const image = event.files[i];
      if (!image) {
        break;
      }
      await reader.readAsDataURL(image);
      reader.onload = async () => {
        await this.resizeImage(reader.result as string).then((resolve: any) => {
          if (i > 2) {
            this.bottomImages[j++] = resolve;
          } else {
            this.topImages[i] = resolve;
          }
        });
      };
    }
  }
  createPost(path:string) {
    this.postDto.PicturesPath = path;
    this.http
      .post(backendUrlBase + 'post/addrentpost/', this.postDto)
      .subscribe((res) => {
        console.log(res);
        this.snackbarService.openSnackbar("Ogłoszenie zostało stworzone","Success");
        this.router.navigate(['']);
      }, (error: HttpErrorResponse)=>{
        switch (error.status) {
          case 401:
            this.errorMessage = 'Nie udało się zautentykować użytkownika';
            this.status = 'Error';
            break;
          default:
            this.errorMessage = 'Nie można połączyć się z serwerem';
            this.status = 'Error';
            break;
        }
        this.snackbarService.openSnackbar(this.errorMessage,this.status);
      });
  }
  sendFileInput() {
    if(this.title.errors && this.description.errors && this.mainCategory.errors && this.sleepingPlaceCount.errors && this.price.errors){
      return;
    }
    this.postDto.Title = this.title.value!;
    this.postDto.Description = this.description.value!;
    this.postDto.MainCategory = this.selectedRentMainCategory;
    this.postDto.SleepingPlaceCount = parseInt(this.sleepingPlaceCount.value!);
    this.postDto.Price = parseFloat(this.price.value!);
    this.postDto.Lat = ' es';
    this.postDto.Lng = ' es';
    this.postDto.Features = ['Klimatyzacja'];
    this.postDto.Categories = ['es'];
    this.postDto.BuildingNumber = 'es';
    this.postDto.Street = 'es';
    this.postDto.District = 'es';
    this.postDto.City = 'es';
    this.postDto.Country = 'es';
    this.data = new FormData();
    if (this.topImages.length < 1) {
      this.snackbarService.openSnackbar('Nie wybrano zdjęcia', 'Error');
      return null;
    }
    const headers = new HttpHeaders().set(
      'Content-Type',
      'multipart/form-data'
    );
    for (let i = 0; i < this.topImages.length; i++) {
      this.data.append('Pictures', this.urlToFile(this.topImages[i]));
    }
    for (let i = 0; i < this.bottomImages.length; i++) {
      this.data.append('Pictures', this.urlToFile(this.bottomImages[i]));
    }
    this.http.post(
      backendUrlBase + 'post/addpicturestopost/',
      this.data,
      {
        headers: headers,
        responseType: 'text',
      }
    ).subscribe({
      next: (response : string) => {
        this.createPost(response);
      }
    });
    return "";
  }
  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 1280, 720);
        }
        var data = canvas.toDataURL('image/png', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }
  urlToFile(url: string) {
    url = url.replace('data:image/png;base64,', '');
    const bytesArray = new Uint8Array(
      atob(url)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([bytesArray], { type: 'image/png' });
    return blob;
  }
}
