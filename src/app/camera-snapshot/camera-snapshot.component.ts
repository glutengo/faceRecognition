import { Component, ViewChild, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BlockUIService } from '../block-ui.service';

@Component({
  selector: 'app-camera-snapshot',
  templateUrl: './camera-snapshot.component.html',
  styleUrls: ['./camera-snapshot.component.css']
})
export class CameraSnapshotComponent implements OnInit {

  private mediaStream;
  @Input() imageUrl: string;
  @Output() imageCreated = new EventEmitter();
  @ViewChild('video') private video;
  @ViewChild('canvas') private canvas;

  constructor(private ref: ChangeDetectorRef, private blockUI: BlockUIService) { }

  ngOnInit() {
  }

  getCameraImage() {
    this.blockUI.start();
    this.imageUrl = undefined;
    this.imageCreated.emit(undefined);
    navigator.getUserMedia(
      {video:true},
      mediaStream => {
        this.mediaStream = mediaStream;
        this.video.nativeElement.src = window.URL.createObjectURL(mediaStream);
        setTimeout(() => {
          var ctx = this.canvas.nativeElement.getContext('2d');
          ctx.drawImage(this.video.nativeElement, 0, 0, 500, 380);
          this.imageUrl = this.canvas.nativeElement.toDataURL()
          this.imageCreated.emit(this.imageUrl);
          this.mediaStream.getVideoTracks()[0].stop();
          this.blockUI.stop();
          this.ref.detectChanges();
        }, 3000);
      },
      error => {});
  }

}
