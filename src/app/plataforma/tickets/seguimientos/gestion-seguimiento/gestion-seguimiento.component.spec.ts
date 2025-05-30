import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSeguimientoComponent } from './gestion-seguimiento.component';

describe('GestionSeguimientoComponent', () => {
  let component: GestionSeguimientoComponent;
  let fixture: ComponentFixture<GestionSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSeguimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
