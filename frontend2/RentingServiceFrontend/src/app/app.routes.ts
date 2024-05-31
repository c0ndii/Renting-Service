import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { CreatePostComponent } from './create-post/create-post.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', component: SidenavbarComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'addpost', component: CreatePostComponent}
];