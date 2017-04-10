import { Component, ViewChild, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import { UserRestService } from '../../services/user-rest.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  imageUrl;
  scaleFactor;
  username;
  password;
  loginMethod: string = 'camera';
  faces = [];

  constructor(private router: Router, private userRestService: UserRestService, private auth: AuthService, private ref: ChangeDetectorRef, private snackBar: MdSnackBar) { }

  ngOnInit() {}

  // login method
  login(face) {
    // set params: password or imageUrl, depending on chosen loginMethod
    var params: any = {
      username: this.username
    };
    if(face && face.faceId) {
      params.faceId = face.faceId
    }
    else if(this.loginMethod === 'password') {
      params.password = this.password;
    }
    else {
      params.image = this.imageUrl;
    }

    // perform http call
    this.userRestService.login(params)
      .subscribe( data => {
          // on success set token and user data
          var token = data.token;
          this.auth.setToken(token);
          this.auth.setUser({username: this.username});
          
          // navigate to home page
          this.router.navigate(['/home']);
        },
        error => {
          var err = error.json();
          if(err.faces) {
            this.faces = err.faces;
          }
        });
  }

  // image changed handler for embedded components (image picker, camera snapshot)
  imageChanged(data) {
    this.scaleFactor = data.scaleFactor;
    this.imageUrl = data.imageUrl;
    this.ref.detectChanges();
  }

}
