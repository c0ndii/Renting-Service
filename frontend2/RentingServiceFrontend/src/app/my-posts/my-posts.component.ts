import { Component, OnInit } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { Observable } from 'rxjs';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { CommonModule, NgFor } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [NgFor, MatProgressSpinnerModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatDialogModule, FormsModule, MatInputModule, MatFormFieldModule, MatTooltipModule, CommonModule, MatChipsModule],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog, private navbar: NavbarService, private http: HttpClient) {
  }
  rentPosts: forRentPostDto[] = [];
  salePosts: forSalePostDto[] = [];
  selectedValue: string = 'rent';
  ngOnInit(): void {
    this.navbar.disableInputs();
    if(!this.authService.isUserLoggedIn()){
      this.router.navigate(['/login']);
    }
    this.preparePosts();
  }
  preparePosts(){
    this.getRentPosts().subscribe((response) => {
      this.rentPosts = response;
    })
    this.getSalePosts().subscribe((response) => {
      this.salePosts = response;
    });
  }
  getRentPosts() : Observable<forRentPostDto[]> {
    return this.http.get<forRentPostDto[]>(backendUrlBase + "post/userrentposts");
  }
  getSalePosts() : Observable<forSalePostDto[]> {
    return this.http.get<forSalePostDto[]>(backendUrlBase + "post/usersaleposts");
  }
  redirectToRentPost(postId: number){
    this.router.navigate(['rentpost', postId]);
  }
  redirectToSalePost(postId: number){
    this.router.navigate(['salepost', postId]);
  }
}
