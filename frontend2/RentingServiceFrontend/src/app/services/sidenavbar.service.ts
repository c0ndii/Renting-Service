import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { postQuery } from '../interfaces/postQuery';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SidenavbarService {
  postQuery = new BehaviorSubject<postQuery>({} as postQuery);
  filters = new FormGroup({
    searchPhrase: new FormControl(''),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10),
    sortBy: new FormControl('AddDate'),
    postType: new FormControl('rent'),
    sortDirection: new FormControl(1),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    minSquare: new FormControl<number | null>(null),
    maxSquare: new FormControl<number | null>(null),
    minSleepingCount: new FormControl<number | null>(null),
    maxSleepingCount: new FormControl<number | null>(null),
    mainCategory: new FormControl<string | null>(null),
    featureFilters: new FormControl<string[] | null>(null),
  });

  constructor() {
    this.filters.valueChanges.subscribe(() => {
      let queryFilters = {
        searchPhrase: this.filters.controls.searchPhrase.value,
        pageNumber: this.filters.controls.pageNumber.value,
        pageSize: this.filters.controls.pageSize.value,
        sortBy: this.filters.controls.sortBy.value,
        postType: this.filters.controls.postType.value,
        sortDirection: this.filters.controls.sortDirection.value,
        minPrice: this.filters.controls.minPrice.value,
        maxPrice: this.filters.controls.maxPrice.value,
        minSquare: this.filters.controls.minSquare.value,
        maxSquare: this.filters.controls.maxSquare.value,
        minSleepingCount: this.filters.controls.minSleepingCount.value,
        maxSleepingCount: this.filters.controls.maxSleepingCount.value,
        mainCategory: this.filters.controls.mainCategory.value,
        featureFilters: this.filters.controls.featureFilters.value,
      } as postQuery;
      this.postQuery.next(queryFilters);
    });
  }

  resetFilters(postType: string) {
    this.filters.controls.searchPhrase.setValue('');
    this.filters.controls.pageNumber.setValue(1);
    this.filters.controls.pageSize.setValue(10);
    this.filters.controls.sortBy.setValue('AddDate');
    this.filters.controls.postType.setValue(postType);
    this.filters.controls.sortDirection.setValue(1);
    this.filters.controls.minPrice.setValue(null);
    this.filters.controls.maxPrice.setValue(null);
    this.filters.controls.minSquare.setValue(null);
    this.filters.controls.maxSquare.setValue(null);
    this.filters.controls.minSleepingCount.setValue(null);
    this.filters.controls.maxSleepingCount.setValue(null);
    this.filters.controls.mainCategory.setValue(null);
    this.filters.controls.featureFilters.setValue(null);
  }
}
