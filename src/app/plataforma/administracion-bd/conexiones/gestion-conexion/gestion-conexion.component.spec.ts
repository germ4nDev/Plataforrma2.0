import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConexionComponent } from './gestion-conexion.component';

describe('GestionConexionComponent', () => {
  let component: GestionConexionComponent;
  let fixture: ComponentFixture<GestionConexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionConexionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionConexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
