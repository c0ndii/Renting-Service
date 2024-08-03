import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { backendUrlBase } from '../appsettings/constant';
import { getLayers } from '../map-layout/map-layout.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import * as GeoSearch from 'leaflet-geosearch';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NavbarService } from '../services/navbar.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { createForSalePostDto } from '../interfaces/createForSalePostDto';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-sale-post',
  standalone: true,
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
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
  templateUrl: './edit-sale-post.component.html',
  styleUrl: './edit-sale-post.component.scss',
})
export class EditSalePostComponent {
  private sub: any;
  postId?: number;
  mapSearchProvider = new OpenStreetMapProvider();
  searchBar = GeoSearch.GeoSearchControl({
    provider: this.mapSearchProvider,

    style: 'button',
    position: 'topright',
    autoComplete: true,
    autoCompleteDelay: 250,
    searchLabel: 'Wpisz adres',
  });
  title = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
    Validators.minLength(8),
  ]);
  description = new FormControl('', [
    Validators.required,
    Validators.maxLength(500),
    Validators.minLength(20),
  ]);
  squareFootage = new FormControl(1, [Validators.required, Validators.min(1)]);
  price = new FormControl(1, [Validators.required, Validators.min(1)]);
  topImages: string[] = [];
  bottomImages: string[] = [];
  postDto = {} as createForSalePostDto;
  mainSaleCategories: string[] = [];
  selectedSaleMainCategory: string = '';
  errorMessage: string = '';
  parsedAddress: string[] = [];
  status: string = '';
  marker: Leaflet.Marker = new Leaflet.Marker(new Leaflet.LatLng(52.13, 21.0));
  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    zoomControl: false,
    center: new Leaflet.LatLng(52.13, 21.0),
  };
  picture = new FormControl('', [Validators.required]);
  data = new FormData();
  emptyAddress: boolean = false;
  post = new BehaviorSubject<forSalePostDto>({} as forSalePostDto);
  private mapLoaded = new BehaviorSubject<boolean>(false);

  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private http: HttpClient,
    private navbar: NavbarService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.http
      .get<string[]>(backendUrlBase + 'maincategory/sale')
      .subscribe((res) => {
        this.mainSaleCategories = res;
      });
    this.selectedSaleMainCategory = 'Mieszkanie';
  }

  isUserOwner() {
    return this.http
      .get<boolean>(backendUrlBase + 'post/isowner/' + this.postId)
      .subscribe();
  }

  ngOnInit(): void {
    this.navbar.disableInputs();
    if (!this.authService.userLogged()) {
      this.router.navigate(['/login']);
    }
    if (!this.isUserOwner()) {
      this.router.navigate(['myposts']);
    }
    this.sub = this.route.params.subscribe((params) => {
      this.postId = +params['id'];
    });
    this.preparePostData();
    this.mapLoaded.subscribe((loaded) => {
      if (loaded) {
        this.post.asObservable().subscribe((data) => {
          this.map.setView([Number(data.lat), Number(data.lng)], 16);
          let marker = new Leaflet.Marker(
            new Leaflet.LatLng(Number(data.lat), Number(data.lng))
          );
          this.parsedAddress[0] = 'test';
          this.emptyAddress = false;
          marker.addTo(this.map);
        });
      }
    });
  }

  getPostData(): Observable<forSalePostDto> {
    return this.http.get<forSalePostDto>(
      backendUrlBase + 'post/salepost/' + this.postId
    );
  }

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

  readyUpMap(map: Leaflet.Map) {
    this.map = map;
    this.map.addControl(Leaflet.control.zoom({ position: 'bottomright' }));
    this.searchBar.onSubmit = (query: any) => {
      if (
        query.data.raw.addresstype == 'building' ||
        query.data.raw.addresstype == 'place'
      ) {
        this.emptyAddress = false;
        this.map.setView([query.data.y, query.data.x], 15);
        this.marker.setLatLng([query.data.y, query.data.x]);
        this.marker.addTo(this.map);
        this.postDto.Lat = query.data.y + '';
        this.postDto.Lng = query.data.x + '';
        this.parsedAddress = query.data.raw.display_name.split(', ');
        if (this.parsedAddress.length == 7) {
          this.postDto.BuildingNumber = this.parsedAddress[0];
          this.postDto.Street = this.parsedAddress[1];
          this.postDto.District = this.parsedAddress[2];
          this.postDto.City = this.parsedAddress[3];
          this.postDto.Country = this.parsedAddress[6];
        } else {
          this.postDto.BuildingNumber = this.parsedAddress[0];
          this.postDto.Street = this.parsedAddress[1];
          this.postDto.District = this.parsedAddress[3];
          this.postDto.City = this.parsedAddress[4];
          this.postDto.Country = this.parsedAddress[7];
        }
        this.searchBar.close();
      } else {
        this.emptyAddress = true;
        this.searchBar.clearResults();
      }
    };
    this.map.addControl(this.searchBar);
    this.mapLoaded.next(true);
    //this.map.on('click', <LeafletMouseEvent>(e: any) => { console.log(e.latlng) });
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

  createPost(path: string) {
    this.postDto.PicturesPath = path;
    this.http
      .put(backendUrlBase + 'post/editsalepost/' + this.postId, this.postDto)
      .subscribe(
        (res) => {
          this.snackbarService.openSnackbar(
            'Ogłoszenie zostało zaktualizowane',
            'Success'
          );
          this.router.navigate(['myposts']);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
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
          this.snackbarService.openSnackbar(this.errorMessage, this.status);
        }
      );
  }

  preparePostData() {
    this.getPostData().subscribe((response: forSalePostDto) => {
      let i = 0;
      this.title.setValue(response.title);
      this.description.setValue(response.description);
      this.squareFootage.setValue(response.squareFootage);
      this.price.setValue(response.price);
      this.postDto.Title = response.title;
      this.postDto.Description = response.description;
      this.postDto.MainCategory = response.mainCategory;
      this.postDto.SquareFootage = response.squareFootage;
      this.postDto.Price = response.price;
      this.postDto.PicturesPath = response.picturesPath;
      this.postDto.BuildingNumber = response.buildingNumber;
      this.postDto.Street = response.street;
      this.postDto.District = response.district;
      this.postDto.City = response.city;
      this.postDto.Country = response.country;
      this.postDto.Lat = response.lat;
      this.postDto.Lng = response.lng;
      response.pictures.forEach((picture) => {
        if (i > 2) {
          this.bottomImages[i - 3] = 'data:image/png;base64,' + picture;
        } else {
          this.topImages[i] = 'data:image/png;base64,' + picture;
        }
        i++;
      });
      this.post.next(response);
    });
  }

  sendFileInput() {
    if (this.parsedAddress.length <= 0) {
      this.emptyAddress = true;
      return;
    }
    this.emptyAddress = false;
    if (
      this.title.errors ||
      this.description.errors ||
      this.price.errors ||
      this.squareFootage.errors
    ) {
      return;
    }
    this.postDto.Title = this.title.value!;
    this.postDto.Description = this.description.value!;
    this.postDto.MainCategory = this.selectedSaleMainCategory;
    this.postDto.Price = this.price.value!;
    this.postDto.SquareFootage = this.squareFootage.value!;
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
    this.http
      .post(backendUrlBase + 'post/addpicturestopost/', this.data, {
        headers: headers,
        responseType: 'text',
      })
      .subscribe({
        next: (response: string) => {
          this.createPost(response);
        },
      });
    return '';
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
