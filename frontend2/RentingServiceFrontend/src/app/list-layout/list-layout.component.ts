import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavbarService } from '../services/navbar.service';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forRentPostDto } from '../interfaces/forRentPostDto';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { forSalePostDto } from '../interfaces/forSalePostDto';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { SnackbarService } from '../services/snackbar.service';
import { postDto } from '../interfaces/postDto';
import { SidenavbarService } from '../services/sidenavbar.service';
import { postQuery } from '../interfaces/postQuery';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { pageResult } from '../interfaces/pageResult';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-layout',
  standalone: true,
  imports: [
    NgFor,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    CommonModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list-layout.component.html',
  styleUrl: './list-layout.component.scss',
})
export class ListLayoutComponent implements OnInit {
  constructor(
    protected authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private navbar: NavbarService,
    private http: HttpClient,
    private snackbar: SnackbarService,
    protected sideNavbarService: SidenavbarService
  ) {}
  rentPosts = new BehaviorSubject<postDto[]>([]);
  salePosts = new BehaviorSubject<postDto[]>([]);

  length = new BehaviorSubject<number | null>(null);
  ngOnInit(): void {
    this.switchFilters();
    this.sideNavbarService.postQuery.subscribe(() => {
      this.getPostsFilters();
    });
  }

  switchFilters() {
    this.length.next(1);
    if (this.sideNavbarService.filters.controls.postType.value === 'rent') {
      this.sideNavbarService.resetFilters(
        this.sideNavbarService.filters.controls.postType.value
      );
      this.getRentPosts(this.sideNavbarService.postQuery.value).subscribe(
        (response) => {
          this.length.next(response.totalPages);
          this.rentPosts.next(response.items);
        }
      );
    } else {
      this.sideNavbarService.resetFilters(
        this.sideNavbarService.filters.controls.postType.value!
      );
      this.getSalePosts(this.sideNavbarService.postQuery.value).subscribe(
        (response) => {
          this.length.next(response.totalItemsCount);
          this.salePosts.next(response.items);
        }
      );
    }
  }

  pageChanged(event: PageEvent) {
    this.sideNavbarService.filters.controls.pageNumber.setValue(
      event.pageIndex + 1
    );
  }

  getPostsFilters() {
    if (this.sideNavbarService.postQuery.value.postType === 'rent') {
      this.getRentPostsFilters();
    } else {
      this.getSalePostsFilters();
    }
  }

  getRentPostsFilters() {
    this.getRentPosts(this.sideNavbarService.postQuery.value).subscribe(
      (response) => {
        this.length.next(response.totalItemsCount);
        this.rentPosts.next(response.items);
      }
    );
  }

  getSalePostsFilters() {
    this.getSalePosts(this.sideNavbarService.postQuery.value).subscribe(
      (response) => {
        this.length.next(response.totalItemsCount);
        this.salePosts.next(response.items);
      }
    );
  }

  prepareFilterUrl(filters: postQuery) {
    let query: string = '';
    if (filters.searchPhrase !== null && filters.searchPhrase.length > 0) {
      query += '?SearchPhrase=' + filters.searchPhrase;
    }
    if (query.length <= 0) {
      query += '?PageNumber=' + filters.pageNumber;
    } else {
      query += '&PageNumber=' + filters.pageNumber;
    }
    query += '&PageSize=' + filters.pageSize;
    if (filters.sortBy === null) {
      query += '&SortBy=AddDate';
    } else {
      query += '&SortBy=' + filters.sortBy;
    }
    if (filters.sortDirection === null) {
      query += '&SortDirection=1';
    } else {
      query += '&SortDirection=' + filters.sortDirection;
    }
    query += '&PostType=' + filters.postType;
    if (filters.minPrice !== null) {
      query += '&MinPrice=' + filters.minPrice;
    }
    if (filters.maxPrice !== null) {
      query += '&MaxPrice=' + filters.maxPrice;
    }
    if (filters.minSquare !== null) {
      query += '&MinSquare=' + filters.minSquare;
    }
    if (filters.maxSquare !== null) {
      query += '&MaxSquare=' + filters.maxSquare;
    }
    if (filters.minSleepingCount !== null) {
      query += '&MinSleepingCount=' + filters.minSleepingCount;
    }
    if (filters.maxSleepingCount !== null) {
      query += '&MaxSleepingCount=' + filters.maxSleepingCount;
    }
    if (filters.mainCategory !== null) {
      query += '&MainCategory=' + filters.mainCategory;
    }
    if (filters.featureFilters && filters.featureFilters?.length > 0) {
      let features = '';
      for (let i = 0; i < filters.featureFilters.length; i++) {
        features += '&FeatureFilters=' + filters.featureFilters[i];
      }
      query += features;
    }
    return query;
  }

  getRentPosts(filters: postQuery): Observable<pageResult> {
    let query = this.prepareFilterUrl(filters);
    return this.http.get<pageResult>(backendUrlBase + 'post/posts' + query);
  }
  getSalePosts(filters: postQuery): Observable<pageResult> {
    let query = this.prepareFilterUrl(filters);
    return this.http.get<pageResult>(backendUrlBase + 'post/posts' + query);
  }
  redirectToRentPost(postId: number) {
    this.router.navigate(['rentpost', postId]);
  }
  redirectToSalePost(postId: number) {
    this.router.navigate(['salepost', postId]);
  }
}
