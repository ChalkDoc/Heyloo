import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkdocComponent } from './chalkdoc.component';

describe('ChalkdocComponent', () => {
  let component: ChalkdocComponent;
  let fixture: ComponentFixture<ChalkdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChalkdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
