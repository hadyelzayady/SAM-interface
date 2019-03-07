import { TestBed } from '@angular/core/testing';

import { DiagramApiService } from './diagram-api.service';

describe('DiagramApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiagramApiService = TestBed.get(DiagramApiService);
    expect(service).toBeTruthy();
  });
});
