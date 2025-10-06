import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../models/sales.model';

interface WorkerSales {
  workerId: string;
  workerName: string;
  workerPassport: string;
  workerNationality: string;
  workerType: string;
  sales: Sale[];
  totalSales: number;
  totalRevenue: number;
  activeSales: number;
}

interface SponsorSales {
  sponsorId: string;
  sponsorName: string;
  sponsorEmirates: string;
  sponsorPhone: string;
  sales: Sale[];
  totalSales: number;
  totalRevenue: number;
  activeSales: number;
}

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css'
})
export class SalesListComponent implements OnInit {
  activeTab: 'workers' | 'sponsors' = 'workers';
  
  allSales: Sale[] = [];
  workerSales: WorkerSales[] = [];
  sponsorSales: SponsorSales[] = [];
  
  filteredWorkerSales: WorkerSales[] = [];
  filteredSponsorSales: SponsorSales[] = [];
  
  // Flat lists for tabular display
  filteredSalesByWorker: Sale[] = [];
  filteredSalesBySponsor: Sale[] = [];
  
  searchTerm: string = '';
  statusFilter: string = 'all';

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.allSales = this.salesService.getAllSales();
    this.groupSalesByWorker();
    this.groupSalesBySponsor();
    this.applyFilters();
  }

  groupSalesByWorker(): void {
    const workerMap = new Map<string, WorkerSales>();

    this.allSales.forEach(sale => {
      if (!workerMap.has(sale.workerId)) {
        workerMap.set(sale.workerId, {
          workerId: sale.workerId,
          workerName: sale.workerName,
          workerPassport: sale.workerPassport,
          workerNationality: sale.workerNationality,
          workerType: sale.workerType,
          sales: [],
          totalSales: 0,
          totalRevenue: 0,
          activeSales: 0
        });
      }

      const worker = workerMap.get(sale.workerId)!;
      worker.sales.push(sale);
      worker.totalSales++;
      
      if (sale.status === 'confirmed') {
        worker.totalRevenue += sale.paidAmount;
      }
      
      if (sale.status === 'trial' || sale.status === 'confirmed') {
        worker.activeSales++;
      }
    });

    this.workerSales = Array.from(workerMap.values())
      .sort((a, b) => b.totalSales - a.totalSales);
  }

  groupSalesBySponsor(): void {
    const sponsorMap = new Map<string, SponsorSales>();

    this.allSales.forEach(sale => {
      if (!sponsorMap.has(sale.sponsorId)) {
        sponsorMap.set(sale.sponsorId, {
          sponsorId: sale.sponsorId,
          sponsorName: sale.sponsorName,
          sponsorEmirates: sale.sponsorEmirates,
          sponsorPhone: sale.sponsorPhone,
          sales: [],
          totalSales: 0,
          totalRevenue: 0,
          activeSales: 0
        });
      }

      const sponsor = sponsorMap.get(sale.sponsorId)!;
      sponsor.sales.push(sale);
      sponsor.totalSales++;
      
      if (sale.status === 'confirmed') {
        sponsor.totalRevenue += sale.paidAmount;
      }
      
      if (sale.status === 'trial' || sale.status === 'confirmed') {
        sponsor.activeSales++;
      }
    });

    this.sponsorSales = Array.from(sponsorMap.values())
      .sort((a, b) => b.totalSales - a.totalSales);
  }

  switchTab(tab: 'workers' | 'sponsors'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    // Worker Sales Filter (Grouped)
    this.filteredWorkerSales = this.workerSales.filter(worker => {
      const matchesSearch = worker.workerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           worker.workerPassport.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
                           worker.sales.some(sale => sale.status === this.statusFilter);
      
      return matchesSearch && matchesStatus;
    });

    // Sponsor Sales Filter (Grouped)
    this.filteredSponsorSales = this.sponsorSales.filter(sponsor => {
      const matchesSearch = sponsor.sponsorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sponsor.sponsorPhone.includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'all' || 
                           sponsor.sales.some(sale => sale.status === this.statusFilter);
      
      return matchesSearch && matchesStatus;
    });

    // Flat Lists for Tabular Display
    this.filteredSalesByWorker = this.allSales.filter(sale => {
      const matchesSearch = sale.workerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.workerPassport.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.workerId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || sale.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    this.filteredSalesBySponsor = this.allSales.filter(sale => {
      const matchesSearch = sale.sponsorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.sponsorPhone.includes(this.searchTerm) ||
                           sale.sponsorId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || sale.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  navigateToSaleDetails(saleId: string): void {
    this.router.navigate(['/sales', saleId]);
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

  getCompletedSalesCount(sales: Sale[]): number {
    return sales.filter(s => s.status === 'confirmed').length;
  }

  getAvatarColor(index: number): string {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  }

  // Worker Actions
  viewWorkerDetails(workerId: string): void {
    console.log('View worker details:', workerId);
    // Navigate to worker details or open modal
  }

  editWorker(workerId: string): void {
    console.log('Edit worker:', workerId);
    // Navigate to edit page or open modal
  }

  deleteWorker(workerId: string): void {
    console.log('Delete worker:', workerId);
    // Show confirmation dialog
  }

  // Sponsor Actions
  viewSponsorDetails(sponsorId: string): void {
    console.log('View sponsor details:', sponsorId);
    // Navigate to sponsor details or open modal
  }

  editSponsor(sponsorId: string): void {
    console.log('Edit sponsor:', sponsorId);
    // Navigate to edit page or open modal
  }

  deleteSponsor(sponsorId: string): void {
    console.log('Delete sponsor:', sponsorId);
    // Show confirmation dialog
  }

  // Sale Actions
  editSale(saleId: string): void {
    console.log('Edit sale:', saleId);
    // Navigate to edit page or open modal
  }

  deleteSale(saleId: string): void {
    console.log('Delete sale:', saleId);
    // Show confirmation dialog
  }
}