import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../models/sales.model';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css'
})
export class SalesListComponent implements OnInit {
  allSales: Sale[] = [];
  filteredSales: Sale[] = [];
  
  searchTerm: string = '';
  statusFilter: string = 'all';

  // Modal
  isModalOpen: boolean = false;
  selectedSale: Sale | null = null;

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.salesService.getSales().subscribe(sales => {
      this.allSales = sales;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredSales = this.allSales.filter(sale => {
      // Search filter
      const matchesSearch = this.searchTerm === '' || 
                           sale.workerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.workerPassport.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.sponsorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.sponsorPhone.includes(this.searchTerm) ||
                           sale.saleCode.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Status filter
      let matchesStatus = false;
      if (this.statusFilter === 'all') {
        matchesStatus = true;
      } else if (this.statusFilter === 'pending') {
        // Pending includes quotation and trial
        matchesStatus = sale.status === 'quotation' || sale.status === 'trial';
      } else {
        matchesStatus = sale.status === this.statusFilter;
      }
      
      return matchesSearch && matchesStatus;
    });
  }

  openDetailsModal(sale: Sale): void {
    this.selectedSale = sale;
    this.isModalOpen = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSale = null;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'quotation': 'bg-yellow-100 text-yellow-800',
      'trial': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'refunded': 'bg-red-100 text-red-800',
      'replaced': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'quotation': 'Pending',
      'trial': 'Pending',
      'confirmed': 'Completed',
      'refunded': 'Refunded',
      'replaced': 'Replaced',
      'cancelled': 'Cancelled'
    };
    return labelMap[status] || status;
  }
}