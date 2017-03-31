import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {

  @Input() imageUrl: string;
  @ViewChild('canvas') private canvas;  
  @Output() imagePicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  imageDataChanged($event) {
    var file    = $event.target.files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", () => {
        var ctx = this.canvas.nativeElement.getContext('2d');
        this.imageUrl = reader.result;
        this.imagePicked.emit(this.imageUrl);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

}
