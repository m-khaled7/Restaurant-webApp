import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessOrder } from './success-order';

describe('SuccessOrder', () => {
  let component: SuccessOrder;
  let fixture: ComponentFixture<SuccessOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
