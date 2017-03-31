import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class BlockUIService {

  private view;

  constructor() { }

  init(view: ViewContainerRef) {
    this.view = view;
  }

  start() {
    if(this.view && this.view.start) {
      this.view.start();
    }
  }

  load() {
    if(this.view && this.view.load) {
      this.view.load();
    }
  }

  stop() {
    if(this.view && this.view.stop) {
      this.view.stop();
    }
  }

}
