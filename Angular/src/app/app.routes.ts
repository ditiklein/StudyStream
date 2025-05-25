import { Routes } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { ShowUsersComponent } from '../component/show-users/show-users.component';
import { AddUserComponent } from '../component/add-user/add-user.component';
import { UserGrowthComponent } from '../component/user-growth/user-growth.component';
import { NavbarComponent } from '../component/navbar/navbar.component';
import { UserStatisticsComponent } from '../component/user-statistics/user-statistics.component';
import { HomeComponent } from '../component/home/home.component';
import { MassageComponent } from '../component/massage/massage.component';
// import { HomeComponent } from '../component/home/home.component';

export const routes: Routes = [
    { path: '', component:  LoginComponent},
  
    { path: 'navbar', component: NavbarComponent,
        children: [
        { path: 'users', component:  ShowUsersComponent},
        { path: 'Add-User', component:  AddUserComponent},
        { path: 'user-statistics', component: UserStatisticsComponent},
         { path: 'home', component:HomeComponent },
        { path: 'massage',component: MassageComponent },

        ]
      },

];
