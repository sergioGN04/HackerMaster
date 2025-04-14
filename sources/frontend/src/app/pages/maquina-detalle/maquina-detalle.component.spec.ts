import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinaDetalleComponent } from './maquina-detalle.component';

describe('MaquinaDetalleComponent', () => {
  let component: MaquinaDetalleComponent;
  let fixture: ComponentFixture<MaquinaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaquinaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaquinaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
