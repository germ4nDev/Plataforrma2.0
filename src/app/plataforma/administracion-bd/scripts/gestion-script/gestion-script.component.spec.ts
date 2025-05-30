import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionScriptComponent } from './gestion-script.component';

describe('GestionScriptComponent', () => {
  let component: GestionScriptComponent;
  let fixture: ComponentFixture<GestionScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionScriptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
