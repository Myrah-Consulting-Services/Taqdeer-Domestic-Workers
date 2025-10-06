import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountsFinanceService } from '../../../services/accounts-finance.service';
import { FinancialSummary } from '../../../models/accounts-finance.model';
import { ExpensesComponent } from '../expenses/expenses.component';
import { CommissionsComponent } from '../commissions/commissions.component';
import { CreditDebitNotesComponent } from '../credit-debit-notes/credit-debit-notes.component';

@Component({
  selector: 'app-accounts-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpensesComponent, CommissionsComponent, CreditDebitNotesComponent],
  templateUrl: './accounts-finance-dashboard.component.html',
  styleUrl: './accounts-finance-dashboard.component.css'
})
export class AccountsFinanceDashboardComponent implements OnInit {
  financialSummary: FinancialSummary | undefined;
  private accountsFinanceService = inject(AccountsFinanceService);

  ngOnInit(): void {
    this.loadFinancialSummary();
  }

  loadFinancialSummary(): void {
    this.financialSummary = this.accountsFinanceService.getFinancialSummary();
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  getProfitMargin(): number {
    if (!this.financialSummary) return 0;
    return (this.financialSummary.netProfit / this.financialSummary.totalRevenue) * 100;
  }

  getProfitStatus(): string {
    const profit = this.financialSummary?.netProfit || 0;
    return profit >= 0 ? 'positive' : 'negative';
  }

  formatCategoryName(category: string): string {
    return category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'office-rent': 'Office Rent',
      'utilities': 'Utilities',
      'staff-salaries': 'Staff Salaries',
      'marketing': 'Marketing',
      'transportation': 'Transportation',
      'office-supplies': 'Office Supplies',
      'professional-services': 'Professional Services',
      'insurance': 'Insurance',
      'maintenance': 'Maintenance',
      'telecommunications': 'Telecommunications',
      'training': 'Training',
      'other': 'Other'
    };
    return categoryMap[category] || this.formatCategoryName(category);
  }
}