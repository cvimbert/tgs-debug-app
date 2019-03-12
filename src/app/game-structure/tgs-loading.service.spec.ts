import { TestBed } from '@angular/core/testing';

import { TgsLoadingService } from './tgs-loading.service';

describe('TgsLoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TgsLoadingService = TestBed.get(TgsLoadingService);
    expect(service).toBeTruthy();
  });
});
