import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequencesManagerComponent } from './sequences-manager.component';

describe('SequencesManagerComponent', () => {
  let component: SequencesManagerComponent;
  let fixture: ComponentFixture<SequencesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequencesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequencesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
