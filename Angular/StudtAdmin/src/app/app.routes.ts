import { Routes } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { ShowUsersComponent } from '../component/show-users/show-users.component';
import { AddUserComponent } from '../component/add-user/add-user.component';
import { UserGrowthComponent } from '../component/user-growth/user-growth.component';

export const routes: Routes = [
    { path: '', component:  LoginComponent},
    { path: 'users', component:  ShowUsersComponent},
    { path: 'Add-User', component:  AddUserComponent},


];
