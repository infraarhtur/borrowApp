import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedPaymentComponent } from './created-payment.component';

describe('CreatedPaymentComponent', () => {
  let component: CreatedPaymentComponent;
  let fixture: ComponentFixture<CreatedPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
