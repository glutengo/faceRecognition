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
  private user:any = {};
  registerMethod = 'camera';

  constructor(private userRestService: UserRestService, private router: Router, private auth: AuthService, private ref: ChangeDetectorRef) { 
  }

  ngOnInit() {}

  // register method
  register() {

    // post user data and image url
    this.userRestService.register({
      user: this.user,
      image: this.imageUrl
    }).subscribe(data => {
        var token = data.token;
        this.auth.setToken(token);
        this.auth.setUser({username: this.user.username});
        this.router.navigate(['/home']);
    });

  }

  // image changed handler for embedded components (image picker, camera snapshot)
  imageChanged(data) {
    this.imageUrl = data;
    this.ref.detectChanges();
  }

}