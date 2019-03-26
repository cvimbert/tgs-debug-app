import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableItemSlotComponent } from './variable-item-slot.component';

describe('VariableItemSlotComponent', () => {
  let component: VariableItemSlotComponent;
  let fixture: ComponentFixture<VariableItemSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableItemSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableItemSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
