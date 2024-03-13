import { Component } from '@angular/core';
import { SidenavbarComponent } from '../sidenavbar/sidenavbar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarLoggedComponent } from '../navbar-logged/navbar-logged.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ SidenavbarComponent, RouterOutlet, NavbarComponent, SidenavbarComponent, NavbarLoggedComponent, CommonModule ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isLogged: boolean = false;
}
