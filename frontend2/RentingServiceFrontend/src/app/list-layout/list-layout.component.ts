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
import { MatPaginatorModule } from '@angular/material/paginator';
import { pageResult } from '../interfaces/pageResult';

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
    private sideNavbarService: SidenavbarService
  ) {}
  rentPosts = new BehaviorSubject<postDto[]>([]);
  salePosts = new BehaviorSubject<postDto[]>([]);
  length = new BehaviorSubject<number>(10);

  pageNumber = new BehaviorSubject<number>(0);
  pageSize = new BehaviorSubject<number>(10);

  selectedValue: string = 'rent';
  ngOnInit(): void {
    this.switchFilters();
  }

  switchFilters() {
    this.length.next(1);
    this.pageNumber.next(0);
    this.pageSize.next(10);
    if (this.selectedValue == 'rent') {
      this.sideNavbarService.resetFilters(this.selectedValue);
      let filters = {
        searchPhrase: this.sideNavbarService.searchPhrase.value,
        pageNumber: this.pageNumber.value,
        pageSize: this.pageSize.value,
        postType: this.selectedValue,
        sortBy: this.sideNavbarService.sortBy.value,
        sortDirection: this.sideNavbarService.sortDirection.value,
        minPrice: this.sideNavbarService.minPrice.value,
        maxPrice: this.sideNavbarService.maxPrice.value,
        minSquare: this.sideNavbarService.minSquare.value,
        maxSquare: this.sideNavbarService.maxSquare.value,
        minSleepingCount: this.sideNavbarService.minSleepingCount.value,
        maxSleepingCount: this.sideNavbarService.maxSleepingCount.value,
        mainCategory: this.sideNavbarService.mainCategory.value,
        featureFilters: this.sideNavbarService.featureFilters.value,
      } as postQuery;

      this.getRentPosts(filters).subscribe((response) => {
        this.length.next(response.totalPages);
        this.rentPosts.next(response.items);
      });
    } else {
      this.sideNavbarService.resetFilters(this.selectedValue);
      let filters = {
        searchPhrase: this.sideNavbarService.searchPhrase.value,
        pageNumber: this.pageNumber.value,
        pageSize: this.pageSize.value,
        postType: this.selectedValue,
        sortBy: this.sideNavbarService.sortBy.value,
        sortDirection: this.sideNavbarService.sortDirection.value,
        minPrice: this.sideNavbarService.minPrice.value,
        maxPrice: this.sideNavbarService.maxPrice.value,
        minSquare: this.sideNavbarService.minSquare.value,
        maxSquare: this.sideNavbarService.maxSquare.value,
        minSleepingCount: this.sideNavbarService.minSleepingCount.value,
        maxSleepingCount: this.sideNavbarService.maxSleepingCount.value,
        mainCategory: this.sideNavbarService.mainCategory.value,
        featureFilters: this.sideNavbarService.featureFilters.value,
      } as postQuery;

      this.getSalePosts(filters).subscribe((response) => {
        this.length.next(response.totalPages);
        this.salePosts.next(response.items);
      });
    }
  }

  getPostsFilters(e: any) {
    this.pageNumber.next(e.pageIndex);
    if (this.selectedValue === 'rent') {
      this.getRentPostsFilters();
    } else {
      this.gerSalePostsFilters();
    }
  }

  getRentPostsFilters() {
    let filters = {
      searchPhrase: this.sideNavbarService.searchPhrase.value,
      pageNumber: this.pageNumber.value,
      pageSize: this.pageSize.value,
      postType: 'rent',
      sortBy: this.sideNavbarService.sortBy.value,
      sortDirection: this.sideNavbarService.sortDirection.value,
      minPrice: this.sideNavbarService.minPrice.value,
      maxPrice: this.sideNavbarService.maxPrice.value,
      minSquare: this.sideNavbarService.minSquare.value,
      maxSquare: this.sideNavbarService.maxSquare.value,
      minSleepingCount: this.sideNavbarService.minSleepingCount.value,
      maxSleepingCount: this.sideNavbarService.maxSleepingCount.value,
      mainCategory: this.sideNavbarService.mainCategory.value,
      featureFilters: this.sideNavbarService.featureFilters.value,
    } as postQuery;

    this.getRentPosts(filters).subscribe((response) => {
      this.length.next(response.totalPages);
      this.rentPosts.next(response.items);
    });
  }

  gerSalePostsFilters() {
    let filters = {
      searchPhrase: this.sideNavbarService.searchPhrase.value,
      pageNumber: this.pageNumber.value,
      pageSize: this.pageSize.value,
      postType: 'sale',
      sortBy: this.sideNavbarService.sortBy.value,
      sortDirection: this.sideNavbarService.sortDirection.value,
      minPrice: this.sideNavbarService.minPrice.value,
      maxPrice: this.sideNavbarService.maxPrice.value,
      minSquare: this.sideNavbarService.minSquare.value,
      maxSquare: this.sideNavbarService.maxSquare.value,
      minSleepingCount: this.sideNavbarService.minSleepingCount.value,
      maxSleepingCount: this.sideNavbarService.maxSleepingCount.value,
      mainCategory: this.sideNavbarService.mainCategory.value,
      featureFilters: this.sideNavbarService.featureFilters.value,
    } as postQuery;

    this.getSalePosts(filters).subscribe((response) => {
      this.length.next(response.totalPages);
      this.salePosts.next(response.items);
    });
  }

  prepareFilterUrl(filters: postQuery) {
    let query: string = '';
    if (filters.searchPhrase !== null && filters.searchPhrase.length >= 0) {
      query += '?SearchPhrase=' + filters.searchPhrase;
    }
    if (query.length <= 0) {
      query += '?PageNumber=' + filters.pageNumber;
    } else {
      query += '&PageSize=' + filters.pageSize;
    }
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
