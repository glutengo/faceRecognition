import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { UserRestService } from '../../services/user-rest.service';

@Component({
  selector: 'app-update-image',
  templateUrl: './update-image.component.html',
  styleUrls: ['./update-image.component.css']
})
export class UpdateImageComponent implements OnInit {

  private imageUrl;
  private uploadMethod = 'camera';
  private faces = [];
  private scaleFactor = 1;

  constructor(private snackBar: MdSnackBar, private userRestService: UserRestService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  // update user image
  updateImage() {
    this.userRestService.updateImage({
      image: this.imageUrl
    })
      .subscribe( 
        response => {
          this.imageUrl = undefined;
          this.faces = [];
          this.snackBar.open('Image updated', 'Success', {duration: 5000});
        },
        error => {
          this.faces = [];
          var err = error.json();
          if(err.faces) {
            this.faces = err.faces;
          }
        });
  } 

  setFaceId(face) {
    this.userRestService.setFaceId({
      faceId: face.faceId
    })
    .subscribe( 
        response => {
          this.imageUrl = undefined;
          this.faces = [];
          this.snackBar.open('Image updated', 'Success', {duration: 5000});
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
