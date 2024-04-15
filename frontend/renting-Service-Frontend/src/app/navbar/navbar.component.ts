
import {Component, OnInit} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NavbarService } from '../services/navbar.service';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, FormsModule, MatTooltipModule, MatButtonModule, MatInputModule, MatFormFieldModule, RouterModule, CommonModule, MatMenuModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  username: string = '';
  constructor(protected navbar: NavbarService, protected authService: AuthService) {
  }
  ngOnInit(): void {
    this.navbar.UsernameOnReload();
    this.navbar.UserName.subscribe((result: string) => {
      this.username = result;
    })
  }
}
