import { Component, OnInit } from '@angular/core';
import { InterceptorService } from 'ng2-interceptors';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private message: string;
  private greeting = 'Hello, ';
  private user;

  constructor(private http: InterceptorService, private auth: AuthService) { }

  ngOnInit() {
    // get sample data which is only accessible for logged in users (secure endpoint)
    this.http.get('http://localhost:8081/home')
      .map(response => response.json())
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
