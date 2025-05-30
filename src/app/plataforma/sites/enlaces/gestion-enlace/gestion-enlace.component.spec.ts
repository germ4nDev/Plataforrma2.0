import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEnlaceComponent } from './gestion-enlace.component';

describe('GestionEnlaceComponent', () => {
  let component: GestionEnlaceComponent;
  let fixture: ComponentFixture<GestionEnlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEnlaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionEnlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
