import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  constructor() { }
  selectedValue = "map";
  inputsDisabled: boolean = false;
  search_value = '';
  disableInputs(){
    this.inputsDisabled = true;
  }
  enableInputs(){
    this.inputsDisabled = false;
  }
  changeType()
  {
    console.log(this.selectedValue);
    console.log(this.inputsDisabled);
  }
}
