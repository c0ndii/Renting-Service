import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', component: LayoutComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent},
];
