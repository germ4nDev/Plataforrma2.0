import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestonContenidoComponent } from './geston-contenido.component';

describe('GestonContenidoComponent', () => {
  let component: GestonContenidoComponent;
  let fixture: ComponentFixture<GestonContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestonContenidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestonContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
