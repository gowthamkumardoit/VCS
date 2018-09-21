// import { ToastService } from 'ng-uikit-pro-standard';
import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navBarToggle: boolean;
  toastOptions: any = {};
  constructor(private nav: RoleService, private router: Router,
    // private toastService: ToastService
     ) { }

  ngOnInit() {
    this.toastOptions = {
      progressBar: true,
      timeOut: 500,
      toastClass: 'black',
    };

    this.nav.navigationBarShow.subscribe(data => {
      if (data === true) {
        this.navBarToggle = true;
      } else if (data === false) {
        this.navBarToggle = false;
      }
    });
  }

  logout() {
    this.router.navigate(['login']);
    localStorage.clear();
    // this.toastService.success('Logout Successfully',  '', this.toastOptions);

  }

}
