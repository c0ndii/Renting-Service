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

  constructor() {}

  resetFilters(postType: string) {
    this.filters.controls.searchPhrase.setValue('');
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
