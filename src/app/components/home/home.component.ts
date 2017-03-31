import { Component, OnInit } from '@angular/core';
import { UserRestService } from '../../services/user-rest.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private message: string;
  private greeting = 'Hello, ';
  private user;

  constructor(private userRestService: UserRestService, private auth: AuthService) { }

  ngOnInit() {
    // get sample data which is only accessible for logged in users (secure endpoint)
    this.userRestService.home()
      .subscribe(data =>this.message = data.message);

    // get user from auth service. If no user is given, go to login  
    this.user = this.auth.getUser();
    if(!this.user) {
        this.auth.logout();
    }

    // subscribe to future changes on user
    this.auth.user
      .subscribe(data => {
        this.user = data;
    });
  }

}
