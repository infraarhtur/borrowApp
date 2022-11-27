import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDebtComponent } from './detail-debt.component';

describe('DetailDebtComponent', () => {
  let component: DetailDebtComponent;
  let fixture: ComponentFixture<DetailDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDebtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
