import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../services/navbar.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapLayoutComponent } from '../map-layout/map-layout.component';
import { ListLayoutComponent } from '../list-layout/list-layout.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    LeafletModule,
    MapLayoutComponent,
    ListLayoutComponent,
  ],
})
export class LayoutComponent implements OnInit {
  constructor(private navbar: NavbarService) {
    this.navbar.enableInputs();
  }
  ngOnInit(): void {
    this.navbar.SelectedValue.subscribe((result: string) => {
      this.selectedValue = result;
    });
  }
  selectedValue: string = 'map';
  isLogged: boolean = false;
}
