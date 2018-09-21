import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private nav:  RoleService ) {
    this.registerForm = fb.group({
        defaultFormEmail: ['', Validators.required],
        defaultFormPass: ['', [Validators.required, Validators.minLength(8)]],
        defaultFormConfirmPass: ['', [Validators.required, Validators.minLength(8)]]
      });
      this.nav.navigationBarShow.next(false);
  }


  ngOnInit() {
  }

}
