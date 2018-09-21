import { UserService } from './services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MDBBootstrapModulesPro,  DatepickerModule } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './auth/navigation/navigation.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UserComponent } from './components/user/user.component';
import { CompanyComponent } from './components/company/company.component';
import { ServiceComponent } from './components/service/service.component';
import { RoleComponent } from './components/role/role.component';
import { DeleteComponent } from './shared/delete/delete.component';
import { TemplateComponent } from './components/template/template.component';
import { environment } from '../environments/environment';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { DatePipe } from '@angular/common';
// import { ToastModule } from 'ng2-toastr/ng2-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    HomeComponent,
    NavigationComponent,
    MyTasksComponent,
    InboxComponent,
    ReportsComponent,
    UserComponent,
    CompanyComponent,
    ServiceComponent,
    RoleComponent,
    DeleteComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DatepickerModule,
    DateValueAccessorModule,
    MDBBootstrapModulesPro.forRoot(),
   // ToastModule.forRoot()
  ],
  providers: [MDBSpinningPreloader, UserService, DatePipe],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
