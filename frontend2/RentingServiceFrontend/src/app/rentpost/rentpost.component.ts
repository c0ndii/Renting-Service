import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forRentPostDto } from '../interfaces/forRentPostDto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-rentpost',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './rentpost.component.html',
  styleUrl: './rentpost.component.scss'
})
export class RentpostComponent implements OnInit, OnDestroy {
  postId?: number;
  post?: forRentPostDto;
  private sub: any;
  constructor(private route: ActivatedRoute, private http: HttpClient) {

  }
  ngOnInit(): void {
      this.sub = this.route.params.subscribe(params => {
        this.postId = +params['id']; 
      });
      this.preparePostData();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  preparePostData(){
    this.getPostData().subscribe((response : forRentPostDto) => {
      this.post = response;
    })
  }
  getPostData(): Observable<forRentPostDto> {
    return this.http.get<forRentPostDto>(backendUrlBase + "post/rentpost/"+this.postId);
  }
}
