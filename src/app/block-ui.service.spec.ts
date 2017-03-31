import { TestBed, inject } from '@angular/core/testing';

import { BlockUIService } from './block-ui.service';

describe('BlockUIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlockUIService]
    });
  });

  it('should ...', inject([BlockUIService], (service: BlockUIService) => {
    expect(service).toBeTruthy();
  }));
});
