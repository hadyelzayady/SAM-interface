import { TestBed } from '@angular/core/testing';

import { ReserveCommunicationService } from './reserve-communication.service';

describe('ReserveCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReserveCommunicationService = TestBed.get(ReserveCommunicationService);
    expect(service).toBeTruthy();
  });
});
