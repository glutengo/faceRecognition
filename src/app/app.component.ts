import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BlockUIService } from './services/block-ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav;
  @ViewChild('blockUI') blockUI;
  title = 'Face Recogintion';
  user;

  constructor(private router: Router, private auth: AuthService, private blockUIService: BlockUIService) {}

  ngOnInit() {
    // get user from auth service
    this.user = this.auth.getUser();

    // subscribe to future changes on user
    this.auth.user.subscribe(data => {
      this.user = data
    });

    this.blockUIService.init(this.blockUI);
  }

  // naveigate to given route and toggle sidebar
  navigateTo(to: [any]) {
    this.sidenav.toggle();
    this.router.navigate(to);
  }

  // perform logout and toggle sidebar
  logout() {
    this.auth.logout();
    this.sidenav.toggle();
  }

}
