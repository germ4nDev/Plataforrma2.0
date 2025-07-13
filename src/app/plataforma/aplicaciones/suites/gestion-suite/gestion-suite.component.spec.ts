import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSuiteComponent } from './gestion-suite.component';

describe('GestionSuiteComponent', () => {
  let component: GestionSuiteComponent;
  let fixture: ComponentFixture<GestionSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSuiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
