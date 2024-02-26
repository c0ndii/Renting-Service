
import {Component} from '@angular/core';
import { LoginComponent } from '../login/login.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LoginComponent, MatButtonToggleModule, MatIconModule, MatButtonToggleGroup, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  selectedValue = "map";
  changeType()
  {
    console.log(this.selectedValue);
  }
}
