import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-block-ui',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.css']
})
export class BlockUIComponent implements OnInit {

  private show : boolean;
  private loading : boolean;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  start() {
    this.show = true;
    this.ref.detectChanges();
  }

  load() {
    this.show = true;
    this.loading = true;
    this.ref.detectChanges();
  }

  stop() {
    this.show = false;
    this.loading = false;
    this.ref.detectChanges();
  }

}
