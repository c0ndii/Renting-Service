import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { CreateRentPostComponent } from './create-rent-post/create-rent-post.component';
import { CreateSalePostComponent } from './create-sale-post/create-sale-post.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', component: SidenavbarComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'addrentpost', component: CreateRentPostComponent},
    { path: 'addsalepost', component: CreateSalePostComponent}
];