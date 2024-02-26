import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { LayoutComponent } from './layout/layout.component';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, NavbarComponent, LayoutComponent ]
})
export class AppComponent {
  title = 'renting-Service-Frontend';
}
