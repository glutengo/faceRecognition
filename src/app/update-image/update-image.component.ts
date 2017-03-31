import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterceptorService } from 'ng2-interceptors';
import { MdSnackBar } from '@angular/material';


@Component({
  selector: 'app-update-image',
  templateUrl: './update-image.component.html',
  styleUrls: ['./update-image.component.css']
})
export class UpdateImageComponent implements OnInit {

  private imageUrl;
  private uploadMethod = 'camera';

  constructor(private snackBar: MdSnackBar, private http: InterceptorService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  updateImage() {
    this.http.post('http://localhost:8081/updateImage', {
      image: this.imageUrl,
    })
      .subscribe( response => {
        delete this.imageUrl;
        this.snackBar.open('Image updated', 'Success', {duration: 5000});
      });
  }

  // image changed handler for embedded components (image picker, camera snapshot)
  imageChanged(data) {
    this.imageUrl = data;
    this.ref.detectChanges();
  }

}
