import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
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
import { postQuery } from '../interfaces/postQuery';
import { pageResult } from '../interfaces/pageResult';
import { SidenavbarService } from '../services/sidenavbar.service';
import { postDto } from '../interfaces/postDto';
import { postQueryMap } from '../interfaces/postQueryMap';
import { LeafletMarkerClusterModule } from '../marker-cluster/leaflet-markercluster.module';

@Component({
  selector: 'app-map-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    LeafletModule,
    LeafletMarkerClusterModule,
  ],
  templateUrl: './map-layout.component.html',
  styleUrl: './map-layout.component.scss',
})
export class MapLayoutComponent implements OnInit {
  mapSerachProvider = new OpenStreetMapProvider();
  rentPosts = new BehaviorSubject<postDto[]>([]);
  salePosts = new BehaviorSubject<postDto[]>([]);
  // mapSearchResult = await this.mapSerachProvider.search({ query: input.value})
  constructor(
    private navbar: NavbarService,
    private http: HttpClient,
    private router: Router,
    protected sideNavbarService: SidenavbarService
  ) {
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

  markerClusterGroup: Leaflet.MarkerClusterGroup =
    new Leaflet.MarkerClusterGroup({
      animate: true,
      animateAddingMarkers: true,
    });
  markerClusterData: Leaflet.Marker[] = [];
  markerClusterOptions!: Leaflet.MarkerClusterGroupOptions;

  ngOnInit(): void {
    this.switchFilters();
    this.boundaries.subscribe((res) => {
      if (
        res &&
        typeof res.getNorthEast() !== undefined &&
        res.getSouthWest()
      ) {
        let tmp = this.sideNavbarService.postQueryMap.value;
        tmp.northEastLat = res.getNorthEast().lat.toString();
        tmp.northEastLng = res.getNorthEast().lng.toString();
        tmp.southWestLat = res.getSouthWest().lat.toString();
        tmp.southWestLng = res.getSouthWest().lng.toString();
        this.sideNavbarService.postQueryMap.next(tmp);
      }
    });
    this.sideNavbarService.postQueryMap.subscribe(() => {
      this.getPostsFilters();
    });
    this.rentPosts.subscribe((res) => {
      this.markerClusterData = [];
      this.markerClusterGroup.clearLayers();
      res.forEach((post) => {
        let marker = new Leaflet.Marker(
          new Leaflet.LatLng(
            +post.lat.replace(',', '.'),
            +post.lng.replace(',', '.')
          )
        );
        this.markerClusterData.push(marker);
        // this.map.addLayer(this.markersLayer);
      });
      this.markerClusterGroup.addLayers(this.markerClusterData);
    });
    this.salePosts.subscribe((res) => {
      this.markerClusterData = [];
      this.markerClusterGroup.clearLayers();
      res.forEach((post) => {
        let marker = new Leaflet.Marker(
          new Leaflet.LatLng(
            +post.lat.replace(',', '.'),
            +post.lng.replace(',', '.')
          )
        );
        this.markerClusterData.push(marker);
        //this.map.addLayer(this.markersLayer);
      });
      this.markerClusterGroup.addLayers(this.markerClusterData);
    });
  }

  markerClusterReady(group: Leaflet.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  markersLayer = new Leaflet.LayerGroup();
  boundaries = new BehaviorSubject<Leaflet.LatLngBounds | null>(null);

  getPostsFilters() {
    if (this.sideNavbarService.postQueryMap.value.postType === 'rent') {
      this.getRentPostsFilters();
    } else {
      this.getSalePostsFilters();
    }
  }

  getRentPostsFilters() {
    this.getRentPosts(this.sideNavbarService.postQueryMap.value).subscribe(
      (response) => {
        this.rentPosts.next(response.items);
      }
    );
  }

  getSalePostsFilters() {
    this.getSalePosts(this.sideNavbarService.postQueryMap.value).subscribe(
      (response) => {
        this.salePosts.next(response.items);
      }
    );
  }

  switchFilters() {
    if (this.sideNavbarService.filtersMap.controls.postType.value === 'rent') {
      this.sideNavbarService.resetFiltersMap(
        this.sideNavbarService.filtersMap.controls.postType.value
      );
      this.getRentPosts(this.sideNavbarService.postQueryMap.value).subscribe(
        (response) => {
          this.rentPosts.next(response.items);
        }
      );
    } else {
      this.sideNavbarService.resetFiltersMap(
        this.sideNavbarService.filtersMap.controls.postType.value!
      );
      this.getSalePosts(this.sideNavbarService.postQueryMap.value).subscribe(
        (response) => {
          this.salePosts.next(response.items);
        }
      );
    }
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
    var e = this.boundaries;
    //var b = this.markersLayer;
    function onMove(boundaries: Leaflet.LatLngBounds) {
      e.next(boundaries);
    }

    var markers = this.map.on('drag', function (e) {
      //b.clearLayers();
    });
    this.map.on('dragend', function (e) {
      onMove(map.getBounds());
    });
    this.map.on('zoom', function (e) {
      //b.clearLayers();
    });
    this.map.on('zoomend', function (e) {
      onMove(map.getBounds());
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

  prepareFilterUrl(filters: postQueryMap) {
    let query: string = '';
    if (filters.searchPhrase !== null && filters.searchPhrase.length > 0) {
      query += '?SearchPhrase=' + filters.searchPhrase;
    }
    if (query.length <= 0) {
      query += '?PostType=' + filters.postType;
    } else {
      query += '&PostType=' + filters.postType;
    }
    if (filters.minPrice !== null) {
      query += '&MinPrice=' + filters.minPrice;
    }
    if (filters.maxPrice !== null) {
      query += '&MaxPrice=' + filters.maxPrice;
    }
    if (filters.minSquare !== null) {
      query += '&MinSquare=' + filters.minSquare;
    }
    if (filters.maxSquare !== null) {
      query += '&MaxSquare=' + filters.maxSquare;
    }
    if (filters.minSleepingCount !== null) {
      query += '&MinSleepingCount=' + filters.minSleepingCount;
    }
    if (filters.maxSleepingCount !== null) {
      query += '&MaxSleepingCount=' + filters.maxSleepingCount;
    }
    if (filters.mainCategory !== null) {
      query += '&MainCategory=' + filters.mainCategory;
    }
    if (filters.featureFilters && filters.featureFilters?.length > 0) {
      let features = '';
      for (let i = 0; i < filters.featureFilters.length; i++) {
        features += '&FeatureFilters=' + filters.featureFilters[i];
      }
      query += features;
    }
    query +=
      '&northEastLat=' +
      filters.northEastLat +
      '&northEastLng=' +
      filters.northEastLng +
      '&southWestLat=' +
      filters.southWestLat +
      '&southWestLng=' +
      filters.southWestLng;
    return query;
  }

  getRentPosts(filters: postQueryMap): Observable<pageResult> {
    let query = this.prepareFilterUrl(filters);
    return this.http.get<pageResult>(backendUrlBase + 'post/posts/map' + query);
  }
  getSalePosts(filters: postQueryMap): Observable<pageResult> {
    let query = this.prepareFilterUrl(filters);
    return this.http.get<pageResult>(backendUrlBase + 'post/posts/map' + query);
  }
  redirectToRentPost(postId: number) {
    this.router.navigate(['rentpost', postId]);
  }
  redirectToSalePost(postId: number) {
    this.router.navigate(['salepost', postId]);
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
