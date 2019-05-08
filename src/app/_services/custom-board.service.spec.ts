import { TestBed } from '@angular/core/testing';

import { CustomBoardService } from './custom-board.service';

describe('CustomBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomBoardService = TestBed.get(CustomBoardService);
    expect(service).toBeTruthy();
  });
});
