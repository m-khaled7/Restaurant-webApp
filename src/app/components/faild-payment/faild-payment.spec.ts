import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaildPayment } from './faild-payment';

describe('FaildPayment', () => {
  let component: FaildPayment;
  let fixture: ComponentFixture<FaildPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaildPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaildPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
