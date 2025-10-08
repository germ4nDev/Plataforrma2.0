import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPrecioComponent } from './gestion-precio.component';

describe('GestionPrecioComponent', () => {
  let component: GestionPrecioComponent;
  let fixture: ComponentFixture<GestionPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPrecioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
