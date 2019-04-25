import { TestBed } from '@angular/core/testing';

import { SimCommunicationService } from './sim-communication.service';

describe('SimCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimCommunicationService = TestBed.get(SimCommunicationService);
    expect(service).toBeTruthy();
  });
});
