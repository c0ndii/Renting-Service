import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ChangeNameDialogComponent } from '../dialogs/change-name-dialog/change-name-dialog.component';
import { NavbarService } from '../services/navbar.service';
import { ChangePasswordDialogComponent } from '../dialogs/change-password-dialog/change-password-dialog.component';
import { ChangePictureDialogComponent } from '../dialogs/change-picture-dialog/change-picture-dialog.component';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatDialogModule],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog, private navbar: NavbarService) {
  }
  ngOnInit(): void {
    this.navbar.disableInputs();
    if(!this.authService.isUserLoggedIn()){
      this.router.navigate(['/login']);
    }
  }
}
