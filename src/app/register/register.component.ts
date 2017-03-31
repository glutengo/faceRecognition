import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterceptorService } from 'ng2-interceptors';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  imageUrl;
  private user:any = {};
  registerMethod = 'camera';

  constructor(private router: Router, private http: InterceptorService, private auth: AuthService, private ref: ChangeDetectorRef) { 
  }

  ngOnInit() {}

  // register method
  register() {
    // post user data and image url
    this.http.post('http://localhost:8081/register', {
      user: this.user,
      image: this.imageUrl
    })
    .map(response => response.json())
    .subscribe(data => {
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