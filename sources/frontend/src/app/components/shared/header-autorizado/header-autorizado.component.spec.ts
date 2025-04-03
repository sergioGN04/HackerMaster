import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAutorizadoComponent } from './header-autorizado.component';

describe('HeaderAutorizadoComponent', () => {
  let component: HeaderAutorizadoComponent;
  let fixture: ComponentFixture<HeaderAutorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAutorizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
