import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarLoggedComponent } from './navbar-logged/navbar-logged.component';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, LayoutComponent, HttpClientModule, NavbarComponent, NavbarLoggedComponent],
})
export class AppComponent {
  title = 'renting-Service-Frontend';
  isLogged: boolean = false;
}
