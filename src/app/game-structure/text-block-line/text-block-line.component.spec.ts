import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBlockLineComponent } from './text-block-line.component';

describe('TextBlockLineComponent', () => {
  let component: TextBlockLineComponent;
  let fixture: ComponentFixture<TextBlockLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBlockLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBlockLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
