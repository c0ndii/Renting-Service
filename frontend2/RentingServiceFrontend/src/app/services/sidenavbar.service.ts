import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavbarService {
  filterType = new BehaviorSubject<string>('');

  constructor() {}

  toggleRentPostFilters() {}
}
