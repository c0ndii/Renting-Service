import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavbarService {
  searchPhrase = new BehaviorSubject<string>('');
  sortBy = new BehaviorSubject<string>('AddDate');
  postType = new BehaviorSubject<string>('rent');
  sortDirection = new BehaviorSubject<number>(1);
  minPrice = new BehaviorSubject<number | null>(null);
  maxPrice = new BehaviorSubject<number | null>(null);
  minSquare = new BehaviorSubject<number | null>(null);
  maxSquare = new BehaviorSubject<number | null>(null);
  minSleepingCount = new BehaviorSubject<number | null>(null);
  maxSleepingCount = new BehaviorSubject<number | null>(null);
  mainCategory = new BehaviorSubject<string | null>(null);
  featureFilters = new BehaviorSubject<string[] | null>(null);

  constructor() {}

  resetFilters(postType: string) {
    this.searchPhrase.next('');
    this.sortBy.next('AddDate');
    this.postType.next(postType);
    this.sortDirection.next(1);
    this.minPrice.next(null);
    this.maxPrice.next(null);
    this.minSquare.next(null);
    this.maxSquare.next(null);
    this.minSleepingCount.next(null);
    this.maxSleepingCount.next(null);
    this.mainCategory.next(null);
    this.featureFilters.next(null);
  }
}
