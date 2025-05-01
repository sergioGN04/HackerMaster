import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimiteExcedidoComponent } from './limite-excedido.component';

describe('LimiteExcedidoComponent', () => {
  let component: LimiteExcedidoComponent;
  let fixture: ComponentFixture<LimiteExcedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimiteExcedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimiteExcedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
