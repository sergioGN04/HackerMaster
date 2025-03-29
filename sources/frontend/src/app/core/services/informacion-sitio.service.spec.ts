import { TestBed } from '@angular/core/testing';

import { InformacionSitioService } from './informacion-sitio.service';

describe('InformacionSitioService', () => {
  let service: InformacionSitioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionSitioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
