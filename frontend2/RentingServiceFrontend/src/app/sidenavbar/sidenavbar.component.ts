import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { LayoutComponent } from '../layout/layout.component';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SidenavbarService } from '../services/sidenavbar.service';
import { NavbarService } from '../services/navbar.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.scss',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    LayoutComponent,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class SidenavbarComponent implements OnInit {
  constructor(
    protected sideNavbarService: SidenavbarService,
    private navbarService: NavbarService,
    private http: HttpClient
  ) {}
  featureList = new BehaviorSubject<string[]>([]);

  ngOnInit(): void {
    this.getFeatureFilters().subscribe((res) => {
      this.featureList.next(res);
    });
  }

  getFeatureFilters(): Observable<string[]> {
    return this.http.get<string[]>(backendUrlBase + 'feature');
  }
}
