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
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { backendUrlBase } from '../appsettings/constant';
import { getLayers } from '../map-layout/map-layout.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import { createForRentPostDto } from '../interfaces/createForRentPostDto';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule, MatButtonToggleModule, CommonModule , MatSelectModule, LeafletModule, CdkDropList, CdkDrag],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  topImages = [
    'placeholder',
    'placeholder',
    'placeholder',
  ];
  bottomImages = [
    'placeholder',
    'placeholder',
    'placeholder',
  ]
  postDto = {} as createForRentPostDto;
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if(event.container.data[event.previousIndex] === this.topImages[event.previousIndex]){
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          3,
        );
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          0,
          event.currentIndex,
        )
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          0,
        );
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          3,
          event.currentIndex,
        )
      }
      // transferArrayItem(   dobre
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   0,
      // );
      // transferArrayItem(
      //   event.container.data,
      //   event.previousContainer.data,
      //   0,
      //   event.currentIndex,
      // ) 

      // testujemy
      // if(event.container.data[event.previousIndex] === this.topImages[event.previousIndex]){
      //   const item = this.bottomImages[event.currentIndex];
      //   this.bottomImages[event.currentIndex] = this.topImages[event.previousIndex];
      //   this.topImages[event.previousIndex] = item;
      // } else {
      //   const item = this.topImages[event.currentIndex];
      //   this.topImages[event.currentIndex] = this.bottomImages[event.previousIndex];
      //   this.bottomImages[event.previousIndex] = item;
      // } 
      
    }
  }
  constructor(private snackbarService: SnackbarService, private authService: AuthService, private router: Router, private http: HttpClient ) {
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
  picture = new FormControl('', [
    Validators.required,
  ]);
  data = new FormData();
  async handleFileInput(event: any){
    for(let i =0; i < 6; i++){
      const reader = new FileReader();
      const image = event.files[i];
      if(!image){
        continue;
      }
      await reader.readAsDataURL(image);
      reader.onload = async () => {
      await this.resizeImage(reader.result as string ).then((resolve: any) => {
        this.data.append('Picture'+i,this.urlToFile(resolve));
        if(i>2){
          this.bottomImages[i] = resolve;
        } else {
          this.topImages[i] = resolve;
        }
        
      });
    }
    }
  }
  createPost(){
    //todo validacja
    this.postDto.Title = "es";
    this.postDto.Description = "xdd";
    this.postDto.MainCategory = this.selectedMainCategory;
    this.postDto.SleepingPlaceCount = 2;
    this.postDto.Price = 100;
    this.postDto.Lat =" es";
    this.postDto.Lng =" es";
    this.postDto.Features = ["es"];
    this.postDto.Categories = ["es"];
    this.postDto.BuildingNumber = "es";
    this.postDto.Street = "es";
    this.postDto.District = "es";
    this.postDto.City = "es";
    this.postDto.Country = "es";
    // this.sendFileInput()!.subscribe((result: string) => {
    //   this.postDto.PicturesPath = result;
    // })
    console.log(this.postDto);
    return this.http.post(backendUrlBase + 'post/addrentpost/', this.postDto);
  }
  sendFileInput(){
    if(!this.data.get('Picture0')){
      this.snackbarService.openSnackbar("Nie wybrano zdjęcia", "Error");
      return;
    }
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    this.http.post(backendUrlBase + 'post/addpicturestopost/',this.data, {headers: headers}).subscribe(res =>{
      console.log(res);
    });
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
    url = url.replace('data:image/png;base64,','');
    const bytesArray = new Uint8Array(atob(url).split('').map((char) => char.charCodeAt(0)));
    const blob = new Blob([bytesArray], { type: 'image/png' });    
    return blob;
 }
}
