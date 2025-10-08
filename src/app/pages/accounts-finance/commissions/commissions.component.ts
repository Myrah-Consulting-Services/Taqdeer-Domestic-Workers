import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsFinanceService } from '../../../services/accounts-finance.service';
import { AgentCommission, PaymentMethod } from '../../../models/accounts-finance.model';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent implements OnInit {
  commissions: AgentCommission[] = [];
  filteredCommissions: AgentCommission[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  showPaymentModal: boolean = false;
  selectedCommission: AgentCommission | null = null;
  showDetailsModal: boolean = false;
  selectedCommissionDetails: AgentCommission | null = null;
  
  // Payment form data
  paymentData = {
    paymentMethod: '' as PaymentMethod,
    referenceNumber: ''
  };

  paymentMethods: PaymentMethod[] = ['bank-transfer', 'cheque', 'cash'];

  constructor(private accountsFinanceService: AccountsFinanceService) {}

  ngOnInit(): void {
    this.loadCommissions();
  }

  loadCommissions(): void {
    this.commissions = this.accountsFinanceService.getAgentCommissions();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCommissions = this.commissions.filter(commission => {
      const matchesSearch = commission.agentName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           commission.workerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           commission.sponsorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           commission.saleCode.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || commission.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  openPaymentModal(commission: AgentCommission): void {
    this.selectedCommission = commission;
    this.showPaymentModal = true;
    this.paymentData = {
      paymentMethod: 'bank-transfer' as PaymentMethod,
      referenceNumber: ''
    };
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedCommission = null;
  }

  processPayment(): void {
    if (this.selectedCommission && this.paymentData.paymentMethod) {
      const updatedCommission = this.accountsFinanceService.payCommission(
        this.selectedCommission.id,
        this.paymentData
      );
      
      if (updatedCommission) {
        // Update the commission in the list
        const index = this.commissions.findIndex(c => c.id === updatedCommission.id);
        if (index !== -1) {
          this.commissions[index] = updatedCommission;
        }
        this.applyFilters();
        this.closePaymentModal();
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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


  formatPaymentMethod(method: PaymentMethod | undefined): string {
    if (!method) return '';
    return method.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  openDetailsModal(commission: AgentCommission): void {
    this.selectedCommissionDetails = commission;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedCommissionDetails = null;
  }

  openPaymentModalFromDetails(): void {
    if (this.selectedCommissionDetails) {
      this.closeDetailsModal();
      this.openPaymentModal(this.selectedCommissionDetails);
    }
  }

  getPaymentMethodClass(method: PaymentMethod | undefined): string {
    if (!method) return 'bg-gray-100 text-gray-800';
    switch (method) {
      case 'bank-transfer': return 'bg-blue-100 text-blue-800';
      case 'cheque': return 'bg-green-100 text-green-800';
      case 'cash': return 'bg-yellow-100 text-yellow-800';
      case 'credit-card': return 'bg-purple-100 text-purple-800';
      case 'debit-card': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  printCommission(): void {
    if (this.selectedCommissionDetails) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Commission Details - ${this.selectedCommissionDetails.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .section h3 { color: #333; border-bottom: 2px solid #2563EB; padding-bottom: 5px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .label { font-weight: bold; color: #666; }
                .value { color: #333; }
                .amount { font-size: 18px; font-weight: bold; color: #1D4ED8; }
                .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
                .status.paid { background-color: #D1FAE5; color: #065F46; }
                .status.pending { background-color: #FEF3C7; color: #92400E; }
                .status.cancelled { background-color: #FEE2E2; color: #991B1B; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Commission Details</h1>
                <p>Commission ID: ${this.selectedCommissionDetails.id}</p>
              </div>
              
              <div class="section">
                <h3>Commission Information</h3>
                <div class="row">
                  <span class="label">Agent Name:</span>
                  <span class="value">${this.selectedCommissionDetails.agentName}</span>
                </div>
                <div class="row">
                  <span class="label">Agent ID:</span>
                  <span class="value">${this.selectedCommissionDetails.agentId}</span>
                </div>
                <div class="row">
                  <span class="label">Commission Rate:</span>
                  <span class="value">${this.selectedCommissionDetails.commissionRate}%</span>
                </div>
                <div class="row">
                  <span class="label">Commission Amount:</span>
                  <span class="value amount">${this.formatCurrency(this.selectedCommissionDetails.commissionAmount)}</span>
                </div>
                <div class="row">
                  <span class="label">Total Sale Amount:</span>
                  <span class="value">${this.formatCurrency(this.selectedCommissionDetails.totalSaleAmount)}</span>
                </div>
                <div class="row">
                  <span class="label">Status:</span>
                  <span class="value status ${this.selectedCommissionDetails.status}">${this.selectedCommissionDetails.status.toUpperCase()}</span>
                </div>
              </div>

              <div class="section">
                <h3>Sale Information</h3>
                <div class="row">
                  <span class="label">Sale ID:</span>
                  <span class="value">${this.selectedCommissionDetails.saleId}</span>
                </div>
                <div class="row">
                  <span class="label">Sale Code:</span>
                  <span class="value">${this.selectedCommissionDetails.saleCode}</span>
                </div>
                <div class="row">
                  <span class="label">Worker Name:</span>
                  <span class="value">${this.selectedCommissionDetails.workerName}</span>
                </div>
                <div class="row">
                  <span class="label">Sponsor Name:</span>
                  <span class="value">${this.selectedCommissionDetails.sponsorName}</span>
                </div>
              </div>

              ${this.selectedCommissionDetails.status === 'paid' ? `
              <div class="section">
                <h3>Payment Information</h3>
                <div class="row">
                  <span class="label">Payment Date:</span>
                  <span class="value">${this.formatDate(this.selectedCommissionDetails.paymentDate!)}</span>
                </div>
                <div class="row">
                  <span class="label">Payment Method:</span>
                  <span class="value">${this.formatPaymentMethod(this.selectedCommissionDetails.paymentMethod)}</span>
                </div>
                ${this.selectedCommissionDetails.referenceNumber ? `
                <div class="row">
                  <span class="label">Reference Number:</span>
                  <span class="value">${this.selectedCommissionDetails.referenceNumber}</span>
                </div>
                ` : ''}
              </div>
              ` : ''}

              <div class="section">
                <h3>Timeline</h3>
                <div class="row">
                  <span class="label">Created:</span>
                  <span class="value">${this.formatDate(this.selectedCommissionDetails.createdDate)}</span>
                </div>
                <div class="row">
                  <span class="label">Last Updated:</span>
                  <span class="value">${this.formatDate(this.selectedCommissionDetails.lastUpdated)}</span>
                </div>
                ${this.selectedCommissionDetails.status === 'paid' ? `
                <div class="row">
                  <span class="label">Payment Date:</span>
                  <span class="value">${this.formatDate(this.selectedCommissionDetails.paymentDate!)}</span>
                </div>
                ` : ''}
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