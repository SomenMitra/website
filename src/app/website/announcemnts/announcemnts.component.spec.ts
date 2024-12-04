import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncemntsComponent } from './announcemnts.component';

describe('AnnouncemntsComponent', () => {
  let component: AnnouncemntsComponent;
  let fixture: ComponentFixture<AnnouncemntsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncemntsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncemntsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
