import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendVerifyEmailModalComponent } from './resend-verify-email-modal.component';

describe('ResendVerifyEmailModalComponent', () => {
  let component: ResendVerifyEmailModalComponent;
  let fixture: ComponentFixture<ResendVerifyEmailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendVerifyEmailModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendVerifyEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
