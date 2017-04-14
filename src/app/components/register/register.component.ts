import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRestService } from '../../services/user-rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  imageUrl;
  scaleFactor;
  faces = [];
  private user:any = {};
  registerMethod = 'camera';

  constructor(private userRestService: UserRestService, private router: Router, private auth: AuthService, private ref: ChangeDetectorRef) { 
  }

  ngOnInit() {}

  // register method
  register(face) {

    var params : any  = {
      user: this.user
    };

    if(face && face.faceId){
      params.faceId = face.faceId;
    }
    else if(this.imageUrl) {
      params.image = this.imageUrl;
    }

    // post user data and image url
    this.userRestService.register(params)
      .subscribe(data => {
        var token = data.token;
        this.auth.setToken(token);
        this.auth.setUser({username: this.user.username});
        this.router.navigate(['/home']);
      },
      error => {
        var err = error.json();
        if(err.faces) {
          this.faces = err.faces;
        }
        else {
          this.faces = [];
        }
      });
  }

  // image changed handler for embedded components (image picker, camera snapshot)
  imageChanged(data) {
    this.imageUrl = data.imageUrl;
    this.scaleFactor = data.scaleFactor;
    this.faces = [];
    this.ref.detectChanges();
  }

}