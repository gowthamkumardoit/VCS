import { RoleService } from './../../services/role.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private nav: RoleService) { }

  ngOnInit() {
    this.nav.navigationBarShow.next(true);
  }

}
