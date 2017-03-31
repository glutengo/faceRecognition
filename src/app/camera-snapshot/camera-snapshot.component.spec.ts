import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSnapshotComponent } from './camera-snapshot.component';

describe('CameraSnapshotComponent', () => {
  let component: CameraSnapshotComponent;
  let fixture: ComponentFixture<CameraSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraSnapshotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
