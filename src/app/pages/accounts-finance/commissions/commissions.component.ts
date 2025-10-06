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

  getTotalCommissions(): number {
    return this.filteredCommissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);
  }

  getPaidCommissions(): number {
    return this.filteredCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, commission) => sum + commission.commissionAmount, 0);
  }

  getPendingCommissions(): number {
    return this.filteredCommissions
      .filter(c => c.status === 'pending')
      .reduce((sum, commission) => sum + commission.commissionAmount, 0);
  }

  formatPaymentMethod(method: PaymentMethod | undefined): string {
    if (!method) return '';
    return method.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }
}