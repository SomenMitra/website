import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackstatusComponent } from './trackstatus.component';

describe('TrackstatusComponent', () => {
  let component: TrackstatusComponent;
  let fixture: ComponentFixture<TrackstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
