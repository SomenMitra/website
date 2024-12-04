import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeQueryReplyComponent } from './scheme-query-reply.component';

describe('SchemeQueryReplyComponent', () => {
  let component: SchemeQueryReplyComponent;
  let fixture: ComponentFixture<SchemeQueryReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeQueryReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeQueryReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
