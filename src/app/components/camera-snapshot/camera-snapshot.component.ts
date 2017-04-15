import { Component, ViewChild, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BlockUIService } from '../../services/block-ui.service';
import { MdSnackBar } from '@angular/material';


@Component({
  selector: 'app-camera-snapshot',
  templateUrl: './camera-snapshot.component.html',
  styleUrls: ['./camera-snapshot.component.css']
})
export class CameraSnapshotComponent implements OnInit {

  private mediaStream;
  private recording : boolean = false;
  @Input() imageUrl: string;
  @Output() imageCreated = new EventEmitter();
  @ViewChild('video') private video;
  @ViewChild('canvas') private canvas;

  constructor(private ref: ChangeDetectorRef, private blockUI: BlockUIService, private snackbar: MdSnackBar) { }

  ngOnInit() {
  }

  getCameraImage(mediaStream: MediaStream) {
        // block UI and reset image
    this.blockUI.start();
    this.imageUrl = undefined;
    this.imageCreated.emit({imageUrl: undefined});
    this.recording = true;
    this.mediaStream = mediaStream;
    this.video.nativeElement.src = window.URL.createObjectURL(mediaStream);
    this.ref.detectChanges();
    setTimeout(() => {
      // create screenshot and emit as dataUrl
      var ctx = this.canvas.nativeElement.getContext('2d');
      ctx.drawImage(this.video.nativeElement, 0, 0, 500, 380);
      this.imageUrl = this.canvas.nativeElement.toDataURL()
      this.imageCreated.emit({imageUrl: this.imageUrl});
      
      //stop video and blockUI
      this.mediaStream.getVideoTracks()[0].stop();
      this.recording = false;
      this.blockUI.stop();
      this.ref.detectChanges();
    }, 3000);
  }

  onStreamError() {
    this.recording = false;
  }

  initCameraStream() {

    // request access to camera for video
    if(navigator.getUserMedia){
      navigator.getUserMedia({
        video:true
      },
        (mediaStream) => this.getCameraImage(mediaStream),
        () => this.onStreamError()
      )
    }
    else if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      navigator.mediaDevices.getUserMedia({video:true}).then(
        mediaStream => this.getCameraImage(mediaStream),
        () => this.onStreamError()
      )
    }
    else {
        this.snackbar.open('Media streams not supported - try upload', 'Error', {duration: 5000});
    }
  }

}
