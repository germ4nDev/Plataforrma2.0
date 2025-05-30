import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRequerimientoComponent } from './gestion-requerimiento.component';

describe('GestionRequerimientoComponent', () => {
  let component: GestionRequerimientoComponent;
  let fixture: ComponentFixture<GestionRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRequerimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
