import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPasswordComponent } from './gestion-password.component';

describe('GestionPasswordComponent', () => {
  let component: GestionPasswordComponent;
  let fixture: ComponentFixture<GestionPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
