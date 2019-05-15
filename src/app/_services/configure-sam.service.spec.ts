import { TestBed } from '@angular/core/testing';

import { ConfigureSamService } from './configure-sam.service';

describe('ConfigureSamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigureSamService = TestBed.get(ConfigureSamService);
    expect(service).toBeTruthy();
  });
});
