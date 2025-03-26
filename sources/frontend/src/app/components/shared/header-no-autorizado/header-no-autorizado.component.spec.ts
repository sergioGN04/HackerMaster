import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNoAutorizadoComponent } from './header-no-autorizado.component';

describe('HeaderNoAutorizadoComponent', () => {
  let component: HeaderNoAutorizadoComponent;
  let fixture: ComponentFixture<HeaderNoAutorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNoAutorizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNoAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
