import { TestBed } from '@angular/core/testing';

import { LocalWebSocketService } from './local-web-socket.service';

describe('LocalWebSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalWebSocketService = TestBed.get(LocalWebSocketService);
    expect(service).toBeTruthy();
  });
});
