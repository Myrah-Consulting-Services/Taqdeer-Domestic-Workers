import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsFinanceDashboardComponent } from './accounts-finance-dashboard.component';

describe('AccountsFinanceDashboardComponent', () => {
  let component: AccountsFinanceDashboardComponent;
  let fixture: ComponentFixture<AccountsFinanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsFinanceDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsFinanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
