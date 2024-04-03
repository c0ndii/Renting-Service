import { Component } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-navbar-logged',
  standalone: true,
  imports: [ FormsModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './navbar-logged.component.html',
  styleUrl: './navbar-logged.component.scss'
})
export class NavbarLoggedComponent {
  constructor(protected navbar: NavbarService) {
  }
}
