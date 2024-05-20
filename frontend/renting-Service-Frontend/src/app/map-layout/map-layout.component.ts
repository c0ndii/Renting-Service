import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../services/navbar.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';

@Component({
  selector: 'app-map-layout',
  standalone: true,
  imports: [ RouterOutlet, NavbarComponent, CommonModule, LeafletModule ],
  templateUrl: './map-layout.component.html',
  styleUrl: './map-layout.component.scss'
})
export class MapLayoutComponent {
  mapSerachProvider = new OpenStreetMapProvider();
  // mapSearchResult = await this.mapSerachProvider.search({ query: input.value}) 
  constructor(private navbar: NavbarService){
    this.navbar.enableInputs();
  }
  isLogged: boolean = false;
  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    zoomControl: false,
    center: new Leaflet.LatLng(52.13, 21.0)
  };
  readyUpMap(map: Leaflet.Map){
    this.map = map;
    this.map.addControl(Leaflet.control.zoom({ position: 'bottomright' }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setGeoLocation.bind(this));
   }
   var searchBar = GeoSearch.GeoSearchControl({
    provider: this.mapSerachProvider,
    style: 'bar',
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
}
export const getLayers = (): Leaflet.Layer[] => {
  return [
    new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    } as Leaflet.TileLayerOptions),
  ] as Leaflet.Layer[];
};