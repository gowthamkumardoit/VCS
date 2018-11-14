import { TemplateComponent } from './components/template/template.component';
import { ServiceComponent } from './components/service/service.component';
import { RoleComponent } from './components/role/role.component';
import { UserComponent } from './components/user/user.component';
import { ReportsComponent } from './components/reports/reports.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { CompanyComponent } from './components/company/company.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { AuthGuard } from './auth.guard';
import { NewTaskComponent } from './components/new-task/new-task.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent} ,
  { path: 'forgetPassword', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'reports', component: ReportsComponent  },
  { path: 'myTasks', component: NewTaskComponent  },
  { path: 'users', component: UserComponent  },
  { path: 'role', component: RoleComponent  },
  { path: 'company', component: CompanyComponent  },
  { path: 'service', component: ServiceComponent  },
  { path: 'inbox', component: InboxComponent  },
  { path: 'template', component: TemplateComponent  },
  { path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
