import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLeaveComponent } from './add-leave/add-leave.component';
import { InterviewListComponent } from './interview/interview-list/interview-list.component';
import { LeavesComponent } from './leaves/leaves.component';
import { LoginComponent } from './Login/Login.component';
import { MembersAreaComponent } from './MembersArea/MembersArea.component';
import { RegisterComponent } from './Register/Register.component';
import { AuthGuard } from './services/auth.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '', canActivate: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full',
      },
      { path: 'home', component: MembersAreaComponent },
      { path: 'leaves', component: LeavesComponent },
      { path: 'add-leave', component: AddLeaveComponent },
      { path: 'users', component: UsersComponent },
      { path: 'interview', component: InterviewListComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [

  ]
})
export class AppRoutingModule { }
