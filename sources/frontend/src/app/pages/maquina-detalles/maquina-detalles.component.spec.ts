import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinaDetallesComponent } from './maquina-detalles.component';

describe('MaquinaDetallesComponent', () => {
  let component: MaquinaDetallesComponent;
  let fixture: ComponentFixture<MaquinaDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaquinaDetallesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaquinaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
