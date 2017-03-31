import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { InterceptorService } from 'ng2-interceptors';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  private oldPassword: string;
  private newPassword: string;
  private newPasswordConfirm: string;

  constructor(private snackBar: MdSnackBar, private http: InterceptorService) { }

  ngOnInit() {
  }

  updatePassword() {
    if(this.newPassword !== this.newPasswordConfirm){
      this.snackBar.open('new password fields must match','Error',{duration: 5000});
    }
    else {
        this.http.post('http://localhost:8081/updatePassword', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })
        .subscribe(response => {
            delete this.oldPassword;
            delete this.newPassword;
            delete this.newPasswordConfirm;
            this.snackBar.open('password changed','Success', {duration: 5000});
        });
    }
  }

}
