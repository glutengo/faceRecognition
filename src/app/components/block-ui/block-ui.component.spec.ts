import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUIComponent } from './block-ui.component';

describe('BlockUIComponent', () => {
  let component: BlockUIComponent;
  let fixture: ComponentFixture<BlockUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
