import { RoleService } from './../../services/role.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {


  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private nav: RoleService) {
    this.resetForm = fb.group({
        defaultFormEmail: ['', Validators.required],
      });
      this.nav.navigationBarShow.next(false);
  }

  ngOnInit() {
  }

}
