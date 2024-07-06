import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { NavbarService } from '../services/navbar.service';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { forRentPostDto } from '../interfaces/forRentPostDto';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatDialogModule, FormsModule, MatInputModule, MatFormFieldModule, MatTooltipModule, CommonModule],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog, private navbar: NavbarService) {
  }
  rentPosts = {} as forRentPostDto[];
  selectedValue: string = 'rent';
  ngOnInit(): void {
    this.navbar.disableInputs();
    if(!this.authService.isUserLoggedIn()){
      this.router.navigate(['/login']);
    }
  }
}
