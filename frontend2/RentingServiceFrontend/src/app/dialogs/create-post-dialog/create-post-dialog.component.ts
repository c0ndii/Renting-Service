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
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { backendUrlBase } from '../../appsettings/constant';
import { getLayers } from '../../map-layout/map-layout.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';

@Component({
  selector: 'app-create-post-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule, MatButtonToggleModule, CommonModule , MatSelectModule, LeafletModule],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent {
  constructor(private snackbarService: SnackbarService, private authService: AuthService, public dialog: MatDialogRef<CreatePostDialogComponent>, private router: Router, private http: HttpClient ) {
    this.http.get<string[]>(backendUrlBase + 'maincategory/rent').subscribe((res) => {
      this.mainRentCategories = res;
    }
  );
  }
  mapSerachProvider = new OpenStreetMapProvider();
  title = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
  ]);
  description = new FormControl('', [
    Validators.required,
    Validators.maxLength(500),
  ]);
  mainCategory = new FormControl('', [
    Validators.required,
  ]);
  sleepingPlaceCount = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  price = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  features = new FormControl('', [
    Validators.required,
  ]);
  categories = new FormControl('', [
    Validators.required,
  ]);
  checkPostType() : boolean{
    if(this.selectedValue == "rent"){
      return true;
    }
    return false;
  }
  readyUpMap(map: Leaflet.Map){
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
    searchLabel: 'Wpisz adres'
    
   });
   this.map.addControl(searchBar);
  }
  setGeoLocation(position: { coords: { latitude: any; longitude: any } }) {
    const {
       coords: { latitude, longitude },
    } = position;
 
    this.map.setView([latitude, longitude], 15);
 
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
     } ).addTo(this.map);
 }
  mainRentCategories: string[] = [];
  selectedMainCategory: string = "";
  selectedValue: string = 'rent';
  errorMessage: string = '';
  status: string = '';
  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    zoomControl: false,
    center: new Leaflet.LatLng(52.13, 21.0)
  };
  sendFileInput(){
    // if(!this.data.get('Picture')){
    //   this.snackbarService.openSnackbar("Nie wybrano zdjęcia", "Error");
    //   return;
    // }
    // const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    // this.http.patch(backendUrlBase + 'user/editpicture/',this.data, {headers: headers}).subscribe((response) => {
    //   if(response === null){
    //     const img = this.imageSrc.replace('data:image/png;base64,','');
    //     this.authService.changePicture(img);
    //       this.authService.Picture = img;
    //     this.snackbarService.openSnackbar("Zdjęcie zostało dodane", "Success");
    //   }
    //   this.dialog.close();
    // }, (error: HttpErrorResponse) => {
    //   switch (error.status) {
    //     case 401:
    //       this.errorMessage = 'Nie można zmienić zdjęcia innego użytkownika';
    //       this.status = 'Error';
    //       break;
    //     default:
    //       this.errorMessage = 'Nie można połączyć się z serwerem';
    //       this.status = 'Error';
    //       break;
    //   }
    //   this.snackbarService.openSnackbar(this.errorMessage,this.status);
    // });
  }
  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 200, 200);
        }
        var data = canvas.toDataURL('image/png', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }
  urlToFile(url: string) {
    url = url.replace('data:image/png;base64,','');
    const bytesArray = new Uint8Array(atob(url).split('').map((char) => char.charCodeAt(0)));
    const blob = new Blob([bytesArray], { type: 'image/png' });    
    return blob;
 }
}