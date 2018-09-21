import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'VCS';
  loginAccepted: boolean;

  constructor() {}

  ngOnInit() {
    this.loginAccepted = false;
  }
  login(event) {
  }
}
