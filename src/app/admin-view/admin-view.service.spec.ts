import { TestBed } from '@angular/core/testing';

import { AdminViewService } from './admin-view.service';

describe('AdminViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminViewService = TestBed.get(AdminViewService);
    expect(service).toBeTruthy();
  });
});
