import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { Sale, SalesStats } from '../../../models/sales.model';

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
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrl: './sales-dashboard.component.css'
})
export class SalesDashboardComponent implements OnInit {
  // Main tab state
  mainTab: 'dashboard' | 'list' = 'dashboard';
  
  // Dashboard data
  stats: SalesStats | null = null;
  recentSales: Sale[] = [];
  trialPeriodSales: Sale[] = [];
  pendingPayments: Sale[] = [];

  // List data
  allSales: Sale[] = [];
  workerSales: WorkerSales[] = [];
  sponsorSales: SponsorSales[] = [];
  filteredWorkerSales: WorkerSales[] = [];
  filteredSponsorSales: SponsorSales[] = [];
  
  // List tab state
  listTab: 'workers' | 'sponsors' = 'workers';
  searchTerm: string = '';
  statusFilter: string = 'all';

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadListData();
  }

  // Main tab switching
  switchMainTab(tab: 'dashboard' | 'list'): void {
    this.mainTab = tab;
  }

  // Dashboard methods
  loadDashboardData(): void {
    this.salesService.getSales().subscribe(allSales => {
      this.stats = this.salesService.getSalesStats();
      
      // Get recent sales (last 5)
      this.recentSales = allSales
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
        .slice(0, 5);
      
      // Get sales in trial period
      this.trialPeriodSales = allSales.filter(s => s.status === 'trial');
      
      // Get sales with pending payments
      this.pendingPayments = allSales.filter(s => s.paymentStatus === 'advance-paid');
    });
  }

  // List methods
  loadListData(): void {
    this.salesService.getSales().subscribe(sales => {
      this.allSales = sales;
      this.groupSalesByWorker();
      this.groupSalesBySponsor();
      this.applyFilters();
    });
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

  switchListTab(tab: 'workers' | 'sponsors'): void {
    this.listTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    // Worker Sales Filter
    this.filteredWorkerSales = this.workerSales.filter(worker => {
      const matchesSearch = worker.workerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           worker.workerPassport.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
                           worker.sales.some(sale => sale.status === this.statusFilter);
      
      return matchesSearch && matchesStatus;
    });

    // Sponsor Sales Filter
    this.filteredSponsorSales = this.sponsorSales.filter(sponsor => {
      const matchesSearch = sponsor.sponsorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sponsor.sponsorPhone.includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'all' || 
                           sponsor.sales.some(sale => sale.status === this.statusFilter);
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  // Common methods
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

  navigateToSaleDetails(saleId: string): void {
    this.router.navigate(['/sales', saleId]);
  }

  navigateToCreateSale(): void {
    this.router.navigate(['/sales/create']);
  }
}