import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.css']
})
export class FaceComponent implements OnInit {

  @Input () face;
  @Input () scaleFactor = 1;

  constructor() { }

  ngOnInit() {
  }

}
