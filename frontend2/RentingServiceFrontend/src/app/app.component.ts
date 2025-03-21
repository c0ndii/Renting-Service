import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutComponent,
    HttpClientModule,
    NavbarComponent,
  ],
})
export class AppComponent {
  title = 'renting-Service-Frontend';
  constructor(private authService: AuthService) {
    authService.user.next(authService.getUserFromStorage());
  }
}
