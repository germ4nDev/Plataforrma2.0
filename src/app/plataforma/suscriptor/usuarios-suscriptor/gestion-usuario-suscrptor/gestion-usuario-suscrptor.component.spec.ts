import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUsuarioSuscrptorComponent } from './gestion-usuario-suscrptor.component';

describe('GestionUsuarioSuscrptorComponent', () => {
  let component: GestionUsuarioSuscrptorComponent;
  let fixture: ComponentFixture<GestionUsuarioSuscrptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUsuarioSuscrptorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionUsuarioSuscrptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
