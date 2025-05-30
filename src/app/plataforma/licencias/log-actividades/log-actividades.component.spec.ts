import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogActividadesComponent } from './log-actividades.component';

describe('LogActividadesComponent', () => {
  let component: LogActividadesComponent;
  let fixture: ComponentFixture<LogActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogActividadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
