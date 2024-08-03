import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangeNameDialogComponent } from '../dialogs/change-name-dialog/change-name-dialog.component';
import { NavbarService } from '../services/navbar.service';
import { ChangePasswordDialogComponent } from '../dialogs/change-password-dialog/change-password-dialog.component';
import { ChangePictureDialogComponent } from '../dialogs/change-picture-dialog/change-picture-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(
    protected authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private navbar: NavbarService
  ) {}

  openChangeNameDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.dialog.open(ChangeNameDialogComponent, {
      width: '400px',
      minHeight: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openChangePasswordDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      minHeight: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  openChangePictureDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.dialog.open(ChangePictureDialogComponent, {
      width: '400px',
      minHeight: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  ngOnInit(): void {
    this.navbar.disableInputs();
    if (!this.authService.userLogged()) {
      this.router.navigate(['/login']);
    }
  }
}
