import { TestBed } from '@angular/core/testing';

import { TgsMainService } from './tgs-main.service';

describe('TgsMainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TgsMainService = TestBed.get(TgsMainService);
    expect(service).toBeTruthy();
  });
});
