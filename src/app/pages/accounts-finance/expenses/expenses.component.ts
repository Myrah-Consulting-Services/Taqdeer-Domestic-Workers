import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsFinanceService } from '../../../services/accounts-finance.service';
import { AuthService } from '../../../services/auth.service';
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
  showDetailsModal: boolean = false;
  selectedExpense: BusinessExpense | null = null;
  
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

  constructor(
    private accountsFinanceService: AccountsFinanceService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

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

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  approveExpense(expense: BusinessExpense): void {
    if (confirm('Are you sure you want to approve this expense?')) {
      // Update the expense status to approved
      expense.status = 'approved';
      expense.approvedBy = 'Current Admin'; // In real app, get from auth service
      
      // Update the expense in the service
      this.accountsFinanceService.updateExpense(expense);
      
      // Force update the filtered expenses array to trigger UI update
      this.filteredExpenses = this.filteredExpenses.map(exp => 
        exp.id === expense.id ? { ...exp, status: 'approved', approvedBy: 'Current Admin' } : exp
      );
      
      // Also update the main expenses array
      this.expenses = this.expenses.map(exp => 
        exp.id === expense.id ? { ...exp, status: 'approved', approvedBy: 'Current Admin' } : exp
      );
      
      // Force change detection to update the UI
      this.cdr.detectChanges();
      
      // Show success message (you can add a toast notification here)
      alert('Expense approved successfully!');
    }
  }

  openDetailsModal(expense: BusinessExpense): void {
    this.selectedExpense = expense;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedExpense = null;
  }

  printExpense(): void {
    if (this.selectedExpense) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Expense Details - ${this.selectedExpense.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .section h3 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .label { font-weight: bold; color: #666; }
                .value { color: #333; }
                .amount { font-size: 18px; font-weight: bold; color: #2E7D32; }
                .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
                .status.approved { background-color: #C8E6C9; color: #2E7D32; }
                .status.pending { background-color: #FFF3E0; color: #F57C00; }
                .status.rejected { background-color: #FFCDD2; color: #D32F2F; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Expense Details</h1>
                <p>Expense ID: ${this.selectedExpense.id}</p>
              </div>
              
              <div class="section">
                <h3>Basic Information</h3>
                <div class="row">
                  <span class="label">Date:</span>
                  <span class="value">${this.formatDate(this.selectedExpense.date)}</span>
                </div>
                <div class="row">
                  <span class="label">Description:</span>
                  <span class="value">${this.selectedExpense.description}</span>
                </div>
                <div class="row">
                  <span class="label">Category:</span>
                  <span class="value">${this.getCategoryDisplayName(this.selectedExpense.category)}</span>
                </div>
              </div>

              <div class="section">
                <h3>Financial Details</h3>
                <div class="row">
                  <span class="label">Amount:</span>
                  <span class="value amount">${this.formatCurrency(this.selectedExpense.amount)}</span>
                </div>
                <div class="row">
                  <span class="label">Payment Method:</span>
                  <span class="value">${this.formatPaymentMethod(this.selectedExpense.paymentMethod)}</span>
                </div>
                <div class="row">
                  <span class="label">Status:</span>
                  <span class="value status ${this.selectedExpense.status}">${this.selectedExpense.status.toUpperCase()}</span>
                </div>
                <div class="row">
                  <span class="label">Approved By:</span>
                  <span class="value">${this.selectedExpense.approvedBy}</span>
                </div>
              </div>

              <div class="section">
                <h3>Vendor Information</h3>
                <div class="row">
                  <span class="label">Vendor:</span>
                  <span class="value">${this.selectedExpense.vendor}</span>
                </div>
                ${this.selectedExpense.receiptNumber ? `
                <div class="row">
                  <span class="label">Receipt Number:</span>
                  <span class="value">${this.selectedExpense.receiptNumber}</span>
                </div>
                ` : ''}
              </div>

              ${this.selectedExpense.notes ? `
              <div class="section">
                <h3>Additional Notes</h3>
                <p>${this.selectedExpense.notes}</p>
              </div>
              ` : ''}

              <div class="section">
                <h3>Timeline</h3>
                <div class="row">
                  <span class="label">Created:</span>
                  <span class="value">${this.formatDate(this.selectedExpense.date)}</span>
                </div>
                <div class="row">
                  <span class="label">Last Updated:</span>
                  <span class="value">${this.formatDate(this.selectedExpense.date)}</span>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }
}