import { RoleService } from './../../services/role.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private nav: RoleService) { }

  ngOnInit() {
    this.nav.navigationBarShow.next(true);
  }

}
