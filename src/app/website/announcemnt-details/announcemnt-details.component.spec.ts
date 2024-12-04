import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncemntDetailsComponent } from './announcemnt-details.component';

describe('AnnouncemntDetailsComponent', () => {
  let component: AnnouncemntDetailsComponent;
  let fixture: ComponentFixture<AnnouncemntDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncemntDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncemntDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
