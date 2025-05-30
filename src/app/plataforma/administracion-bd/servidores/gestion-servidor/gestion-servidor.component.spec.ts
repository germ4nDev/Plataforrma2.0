import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionServidorComponent } from './gestion-servidor.component';

describe('GestionServidorComponent', () => {
  let component: GestionServidorComponent;
  let fixture: ComponentFixture<GestionServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionServidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
