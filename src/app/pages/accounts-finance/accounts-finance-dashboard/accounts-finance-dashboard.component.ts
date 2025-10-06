import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountsFinanceService } from '../../../services/accounts-finance.service';
import { FinancialSummary } from '../../../models/accounts-finance.model';

@Component({
  selector: 'app-accounts-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts-finance-dashboard.component.html',
  styleUrl: './accounts-finance-dashboard.component.css'
})
export class AccountsFinanceDashboardComponent implements OnInit {
  financialSummary: FinancialSummary | undefined;
  recentExpenses: any[] = [];
  recentCommissions: any[] = [];
  private accountsFinanceService = inject(AccountsFinanceService);

  ngOnInit(): void {
    this.loadFinancialSummary();
    this.loadRecentData();
  }

  loadFinancialSummary(): void {
    this.financialSummary = this.accountsFinanceService.getFinancialSummary();
  }

  loadRecentData(): void {
    // Load recent expenses (hardcoded as requested)
    this.recentExpenses = [
      {
        id: 'EXP001',
        date: '2024-01-15',
        category: 'office-rent',
        description: 'Monthly office rent - Downtown Dubai',
        amount: 6500,
        vendor: 'Dubai Properties LLC',
        status: 'approved'
      },
      {
        id: 'EXP002',
        date: '2024-01-20',
        category: 'staff-salaries',
        description: 'January 2024 staff salaries',
        amount: 6500,
        vendor: 'Internal',
        status: 'approved'
      },
      {
        id: 'EXP003',
        date: '2024-01-25',
        category: 'utilities',
        description: 'DEWA and Etisalat bills',
        amount: 6500,
        vendor: 'DEWA & Etisalat',
        status: 'approved'
      },
      {
        id: 'EXP004',
        date: '2024-01-28',
        category: 'marketing',
        description: 'Google Ads campaign - Domestic workers',
        amount: 6500,
        vendor: 'Google LLC',
        status: 'approved'
      }
    ];

    // Load recent commissions
    this.recentCommissions = this.accountsFinanceService.getRecentCommissions(3);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
      'paid': 'bg-green-100 text-green-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
}