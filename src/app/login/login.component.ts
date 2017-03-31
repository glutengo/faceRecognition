import { Component, ViewChild, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  imageUrl;
  username;
  password;
  loginMethod: string = 'camera';

  constructor(private router: Router, private http: InterceptorService, private auth: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit() {}

  // login method
  login() {
    // set params: password or imageUrl, depending on chosen loginMethod
    var params: any = {
      username: this.username
    };
    if(this.loginMethod === 'password') {
      params.password = this.password;
    }
    else {
      params.image = this.imageUrl;
    }

    // perform http call
    this.http.post('http://localhost:8081/login', {
      username: this.username,
      password: this.password,
      image: this.imageUrl
    })
      .map(response => response.json())
      .subscribe( data => {
          // on success set token and user data
          var token = data.token;
          this.auth.setToken(token);
          this.auth.setUser({username: this.username});
          
          // navigate to home page
          this.router.navigate(['/home']);
        });
  }

  // image changed handler for embedded components (image picker, camera snapshot)
  imageChanged(data) {
    this.imageUrl = data;
    this.ref.detectChanges();
  }

}
