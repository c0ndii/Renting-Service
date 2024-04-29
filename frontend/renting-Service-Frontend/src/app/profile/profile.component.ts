import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  username: string | undefined = '';
  constructor(private authService: AuthService, private router: Router) {
    this.username = authService.getUserName();
  }

  ngOnInit(): void {
    if(this.authService.getJwtToken() === null) {
      this.router.navigate(['']);
    }
  }
}
