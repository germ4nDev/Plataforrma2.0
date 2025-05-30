import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTicketComponent } from './gestion-ticket.component';

describe('GestionTicketComponent', () => {
  let component: GestionTicketComponent;
  let fixture: ComponentFixture<GestionTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
