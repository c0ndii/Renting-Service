import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ RouterOutlet, NavbarComponent, CommonModule ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private navbar: NavbarService){
    this.navbar.enableInputs();
  }
  isLogged: boolean = false;
}
