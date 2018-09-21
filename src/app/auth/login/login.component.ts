import { RoleService } from './../../services/role.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { LoginService } from '../../services/login.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ToastService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @Output('loginValue') loginValue: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private toastService: ToastService,
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
  }

  login() {
    this.loginService.login(this.loginForm.value).subscribe((data: any) => {
      if (data && data.isSaved == 'true') {
        this.loginService.userid.next(data.userid);
        localStorage.setItem('userid', data.userid);
        this.route.navigate(['/home']);
        const options = { timeOut: 500, toastClass: 'black'};
        this.toastService.success('Successfully Logged In', '', options);
      } else {
        const options = { timeOut: 500 };
        this.toastService.error('Username / Password is Invalid', '', options);
      }
    });
  }
}
