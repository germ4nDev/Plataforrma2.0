import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableCascadeComponent } from './data-table-cascade.component';

describe('DataTableCascadeComponent', () => {
  let component: DataTableCascadeComponent;
  let fixture: ComponentFixture<DataTableCascadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableCascadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataTableCascadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
