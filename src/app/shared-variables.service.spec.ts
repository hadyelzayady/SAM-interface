import { TestBed } from '@angular/core/testing';

import { SharedVariablesService } from './shared-variables.service';

describe('SharedVariablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedVariablesService = TestBed.get(SharedVariablesService);
    expect(service).toBeTruthy();
  });
});
