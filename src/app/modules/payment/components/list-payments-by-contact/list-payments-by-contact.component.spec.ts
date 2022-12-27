import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentsByContactComponent } from './list-payments-by-contact.component';

describe('ListPaymentsByContactComponent', () => {
  let component: ListPaymentsByContactComponent;
  let fixture: ComponentFixture<ListPaymentsByContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaymentsByContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaymentsByContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
