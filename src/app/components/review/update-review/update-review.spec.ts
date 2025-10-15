import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReview } from './update-review';

describe('UpdateReview', () => {
  let component: UpdateReview;
  let fixture: ComponentFixture<UpdateReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
