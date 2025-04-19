import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMaquinasComponent } from './gestion-maquinas.component';

describe('GestionMaquinasComponent', () => {
  let component: GestionMaquinasComponent;
  let fixture: ComponentFixture<GestionMaquinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMaquinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMaquinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
