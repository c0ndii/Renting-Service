import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { backendUrlBase } from '../appsettings/constant';
import { LayoutComponent } from '../layout/layout.component';

@Component({
    selector: 'app-sidenavbar',
    standalone: true,
    templateUrl: './sidenavbar.component.html',
    styleUrl: './sidenavbar.component.scss',
    imports: [MatSidenavModule, MatButtonModule, MatIconModule, LayoutComponent]
})
export class SidenavbarComponent{
  showFiller = false;

  constructor(private http: HttpClient) {}
  onClick(){
    return this.http.get(backendUrlBase + 'user/getuser', {}).subscribe(data => {
      console.log(data);
    });
  }
}
