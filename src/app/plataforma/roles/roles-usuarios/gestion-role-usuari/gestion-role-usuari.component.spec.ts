import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRoleUsuariComponent } from './gestion-role-usuari.component';

describe('GestionRoleUsuariComponent', () => {
  let component: GestionRoleUsuariComponent;
  let fixture: ComponentFixture<GestionRoleUsuariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRoleUsuariComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionRoleUsuariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
