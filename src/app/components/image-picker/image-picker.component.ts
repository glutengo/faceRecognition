import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {

  @Input() imageUrl: string;
  @Output() imagePicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  imageDataChanged($event) {
    var file    = $event.target.files[0];
    var reader  = new FileReader();

    // get data from file input and emit as dataUrl
    reader.addEventListener("load", () => {
        this.imageUrl = reader.result;
        var img = new Image();
        img.addEventListener("load", () => {
            var scaleFactor = 1;
            if(img.naturalWidth > 552) {
                scaleFactor = 552 / img.naturalWidth; 
            }
            this.imagePicked.emit({imageUrl: this.imageUrl, scaleFactor: scaleFactor});
        });
        img.src = this.imageUrl;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

}
