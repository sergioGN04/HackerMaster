import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAutorizadoComponent } from './sidebar-autorizado.component';

describe('SidebarAutorizadoComponent', () => {
  let component: SidebarAutorizadoComponent;
  let fixture: ComponentFixture<SidebarAutorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAutorizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
