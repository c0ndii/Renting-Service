import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../services/navbar.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';
import { BehaviorSubject, Observable } from 'rxjs';
import { forRentPostDto } from '../interfaces/forRentPostDto';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';

@Component({
  selector: 'app-map-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, LeafletModule],
  templateUrl: './map-layout.component.html',
  styleUrl: './map-layout.component.scss',
})
export class MapLayoutComponent {
  mapSerachProvider = new OpenStreetMapProvider();
  rentPosts = new BehaviorSubject<forRentPostDto[]>([]);
  salePosts = new BehaviorSubject<forSalePostDto[]>([]);
  // mapSearchResult = await this.mapSerachProvider.search({ query: input.value})
  constructor(private navbar: NavbarService, private http: HttpClient) {
    this.navbar.enableInputs();
  }
  isLogged: boolean = false;
  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    zoomControl: false,
    center: new Leaflet.LatLng(52.13, 21.0),
  };

  ngOnInit(): void {
    this.preparePosts();
  }
  preparePosts() {
    this.getRentPosts().subscribe((response) => {
      this.rentPosts.next(response);
    });
    this.getSalePosts().subscribe((response) => {
      this.salePosts.next(response);
    });
  }

  getRentPosts(): Observable<forRentPostDto[]> {
    return this.http.get<forRentPostDto[]>(backendUrlBase + 'post/rentposts');
  }
  getSalePosts(): Observable<forSalePostDto[]> {
    return this.http.get<forSalePostDto[]>(backendUrlBase + 'post/saleposts');
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
