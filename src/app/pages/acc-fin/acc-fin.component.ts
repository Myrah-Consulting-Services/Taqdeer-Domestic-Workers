import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountsFinanceService } from '../../services/accounts-finance.service';
import { FinancialSummary, BusinessExpense, AgentCommission, EmployeeSalary } from '../../models/accounts-finance.model';
import { ExpensesComponent } from '../accounts-finance/expenses/expenses.component';
import { CommissionsComponent } from '../accounts-finance/commissions/commissions.component';
import { CreditDebitNotesComponent } from '../accounts-finance/credit-debit-notes/credit-debit-notes.component';

@Component({
  selector: 'app-acc-fin',
  standalone: true,
  imports: [CommonModule, RouterModule, ExpensesComponent, CommissionsComponent, CreditDebitNotesComponent],
  templateUrl: './acc-fin.component.html',
  styleUrl: './acc-fin.component.css'
})
export class AccFinComponent implements OnInit {
  financialSummary: FinancialSummary | undefined;
  recentExpenses: BusinessExpense[] = [];
  recentCommissions: AgentCommission[] = [];
  recentEmployeeSalaries: EmployeeSalary[] = [];
  activeTab: 'overview' | 'expenses' | 'commissions' | 'notes' = 'overview';

  constructor(private accountsFinanceService: AccountsFinanceService) {}

  ngOnInit(): void {
    this.loadFinancialSummary();
    this.loadRecentData();
  }

  loadFinancialSummary(): void {
    this.financialSummary = this.accountsFinanceService.getFinancialSummary();
  }

  loadRecentData(): void {
    this.recentExpenses = this.accountsFinanceService.getRecentExpenses(5);
    this.recentCommissions = this.accountsFinanceService.getRecentCommissions(5);
    this.recentEmployeeSalaries = this.accountsFinanceService.getRecentEmployeeSalaries(5);
  }

  switchTab(tab: 'overview' | 'expenses' | 'commissions' | 'notes'): void {
    this.activeTab = tab;
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'paid':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getPaymentMethodDisplay(method: string): string {
    const methodMap: { [key: string]: string } = {
      'bank-transfer': 'Bank Transfer',
      'cash': 'Cash',
      'cheque': 'Cheque',
      'credit-card': 'Credit Card',
      'debit-card': 'Debit Card'
    };
    return methodMap[method] || method;
  }

  getEmployeeInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}