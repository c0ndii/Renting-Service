import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { CreateRentPostComponent } from './create-rent-post/create-rent-post.component';
import { CreateSalePostComponent } from './create-sale-post/create-sale-post.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { RentpostComponent } from './rentpost/rentpost.component';
import { SalepostComponent } from './salepost/salepost.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', component: SidenavbarComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'addrentpost', component: CreateRentPostComponent},
    { path: 'addsalepost', component: CreateSalePostComponent},
    { path: 'myposts', component: MyPostsComponent},
    { path: 'rentpost/:id', component: RentpostComponent},
    { path: 'salepost/:id', component: SalepostComponent}
];