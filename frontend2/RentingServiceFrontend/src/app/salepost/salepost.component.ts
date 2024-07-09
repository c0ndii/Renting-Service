import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';

@Component({
  selector: 'app-salepost',
  standalone: true,
  imports: [],
  templateUrl: './salepost.component.html',
  styleUrl: './salepost.component.scss'
})
export class SalepostComponent implements OnInit, OnDestroy {
  postId?: number;
  post?: forSalePostDto;
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
    this.getPostData().subscribe(response => {
      this.post = response;
    })
  }
  getPostData(): Observable<forSalePostDto> {
    return this.http.get<forSalePostDto>(backendUrlBase + "post/salepost/"+this.postId);
  }
}