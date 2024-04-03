import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.scss'
})
export class SidenavbarComponent{
  showFiller = false;

  constructor(private http: HttpClient) {}
  onClick(){
    return this.http.get(backendUrlBase + 'user/getusername', {}).subscribe(data => {
      console.log(data);
    });
  }
}
