import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContenidoComponent } from './new-contenido.component';

describe('NewContenidoComponent', () => {
  let component: NewContenidoComponent;
  let fixture: ComponentFixture<NewContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewContenidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
