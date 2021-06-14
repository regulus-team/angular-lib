import { TestBed } from '@angular/core/testing';
import { Settings } from 'src/conf/settings';

import { RtPlatformService } from './rt-platform.service';

describe('RtPlatformService', () => {
  let service: RtPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Settings]
    });
    service = TestBed.inject(RtPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
