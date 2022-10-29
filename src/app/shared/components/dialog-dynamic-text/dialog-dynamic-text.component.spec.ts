import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDynamicTextComponent } from './dialog-dynamic-text.component';

describe('DialogDynamicTextComponent', () => {
  let component: DialogDynamicTextComponent;
  let fixture: ComponentFixture<DialogDynamicTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDynamicTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDynamicTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
