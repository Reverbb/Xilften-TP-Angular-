import { TestBed } from '@angular/core/testing';

import { Konami } from './konami';

describe('Konami', () => {
  let service: Konami;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Konami);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
