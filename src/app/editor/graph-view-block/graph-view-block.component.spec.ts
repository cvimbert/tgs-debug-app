import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphViewBlockComponent } from './graph-view-block.component';

describe('GraphViewBlockComponent', () => {
  let component: GraphViewBlockComponent;
  let fixture: ComponentFixture<GraphViewBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphViewBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphViewBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
