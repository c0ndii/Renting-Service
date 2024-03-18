
import {Component, Input} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, FormsModule, MatTooltipModule, MatButtonModule, MatInputModule, MatFormFieldModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  selectedValue = "map";
  clear_value = '';
  @Input()
  inputsDisabled: boolean = false;
  changeType()
  {
    console.log(this.selectedValue);
    console.log(this.inputsDisabled);
  }
}
