import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  constructor(private nav: RoleService) { }

  ngOnInit() {
    this.nav.navigationBarShow.next(true);
  }

}
