import { TestBed, inject } from '@angular/core/testing';

import { UserRestService } from './user-rest.service';

describe('UserRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRestService]
    });
  });

  it('should ...', inject([UserRestService], (service: UserRestService) => {
    expect(service).toBeTruthy();
  }));
});
