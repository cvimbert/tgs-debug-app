import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesInspectorComponent } from './variables-inspector.component';

describe('VariablesInspectorComponent', () => {
  let component: VariablesInspectorComponent;
  let fixture: ComponentFixture<VariablesInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
