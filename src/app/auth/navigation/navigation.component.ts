import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewChecked {
  navBarToggle: boolean;
  toastOptions: any = {};
  userName: string;
  constructor(private nav: RoleService, private router: Router,
      private toastService: ToastrService
     ) { }

  ngOnInit() {
    this.toastOptions = {
      progressBar: true,
      timeOut: 1000,
      toastClass: 'black',
      closeButton: true
    };

    this.nav.navigationBarShow.subscribe(data => {
      if (data === true) {
        this.navBarToggle = true;
      } else if (data === false) {
        this.navBarToggle = false;
      }
    });
  }
  ngAfterViewChecked() {
    this.userName = localStorage.getItem('userName');
  }

  logout() {
    this.router.navigate(['login']);
    localStorage.clear();
    this.toastService.success('Logout Successfully',  '', this.toastOptions);
  }

}
