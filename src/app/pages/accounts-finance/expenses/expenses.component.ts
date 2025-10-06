import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsFinanceService } from '../../../services/accounts-finance.service';
import { BusinessExpense, ExpenseCategory, PaymentMethod, EXPENSE_CATEGORIES } from '../../../models/accounts-finance.model';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  expenses: BusinessExpense[] = [];
  filteredExpenses: BusinessExpense[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  categoryFilter: string = 'all';
  showAddModal: boolean = false;
  
  // Form data for new expense
  newExpense = {
    date: '',
    category: '' as ExpenseCategory,
    description: '',
    amount: 0,
    paymentMethod: '' as PaymentMethod,
    vendor: '',
    receiptNumber: '',
    notes: ''
  };

  expenseCategories = EXPENSE_CATEGORIES;
  paymentMethods: PaymentMethod[] = ['cash', 'bank-transfer', 'cheque', 'credit-card', 'debit-card'];

  constructor(private accountsFinanceService: AccountsFinanceService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenses = this.accountsFinanceService.getBusinessExpenses();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredExpenses = this.expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           expense.vendor.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (expense.receiptNumber && expense.receiptNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.statusFilter === 'all' || expense.status === this.statusFilter;
      const matchesCategory = this.categoryFilter === 'all' || expense.category === this.categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newExpense = {
      date: new Date().toISOString().split('T')[0],
      category: 'other' as ExpenseCategory,
      description: '',
      amount: 0,
      paymentMethod: 'bank-transfer' as PaymentMethod,
      vendor: '',
      receiptNumber: '',
      notes: ''
    };
  }

  addExpense(): void {
    if (this.newExpense.description && this.newExpense.amount > 0) {
      const expense = this.accountsFinanceService.createExpense({
        ...this.newExpense,
        approvedBy: 'Current User', // In real app, get from auth service
        status: 'pending'
      });
      
      this.expenses.unshift(expense);
      this.applyFilters();
      this.closeAddModal();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentMethodClass(method: PaymentMethod): string {
    switch (method) {
      case 'bank-transfer': return 'bg-blue-100 text-blue-800';
      case 'cash': return 'bg-green-100 text-green-800';
      case 'credit-card': return 'bg-purple-100 text-purple-800';
      case 'cheque': return 'bg-orange-100 text-orange-800';
      case 'debit-card': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getCategoryDisplayName(category: ExpenseCategory): string {
    return this.expenseCategories[category] || category;
  }

  formatPaymentMethod(method: PaymentMethod): string {
    return method.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }
}