import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDebitNotesComponent } from './credit-debit-notes.component';

describe('CreditDebitNotesComponent', () => {
  let component: CreditDebitNotesComponent;
  let fixture: ComponentFixture<CreditDebitNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditDebitNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditDebitNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
