import { Component } from '@angular/core';
import { SidenavbarComponent } from '../sidenavbar/sidenavbar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ SidenavbarComponent, RouterOutlet, NavbarComponent, SidenavbarComponent ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
