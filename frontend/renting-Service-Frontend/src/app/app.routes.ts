import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', component: LayoutComponent },
];
