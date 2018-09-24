import { RoleService } from './../../services/role.service';
import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  toastOptions: any;
  @Output('loginValue') loginValue: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private toastService: ToastrService,
    private nav: RoleService,
    private loginService: LoginService
  ) {
    this.loginForm = fb.group({
      uname: ['', Validators.required],
      pwd: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.nav.navigationBarShow.next(false);
  }

  ngOnInit() {
    this.toastOptions = {
      progressBar: true,
      timeOut: 1000,
      toastClass: 'black',
      closeButton: true
    };
  }

  login() {
    this.loginService.login(this.loginForm.value).subscribe((data: any) => {
      if (data && data.isSaved === 'true') {
        this.loginService.userid.next(data.userid);
        localStorage.setItem('userid', data.userid);
        localStorage.setItem('userName', this.loginForm.value.uname);
        this.route.navigate(['/home']);
        this.toastService.success('Successfully Logged In', '', this.toastOptions);
      } else {
        const options = {  progressBar: true, timeOut: 1000,   closeButton: true};
        this.toastService.error('Username / Password is Invalid', '', options);
      }
    });
  }
}
