import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AgentService } from '../../services/agent.service';
import { WorkerService } from '../../services/worker.service';
import { SalesService } from '../../services/sales.service';
import { SponsorService } from '../../services/sponsor.service';
import { EmployeeService } from '../../services/employee.service';
import { AccountsFinanceService } from '../../services/accounts-finance.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  dashboardData: any = {
    // Initialize with default values to prevent undefined access
    totalAgents: 0,
    activeAgents: 0,
    totalWorkers: 0,
    availableWorkers: 0,
    totalSponsors: 0,
    activeSponsors: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    workerStatus: {
      available: 0,
      interview: 0,
      trial: 0,
      placed: 0,
      returned: 0,
      absconded: 0
    },
    salesStatus: {
      active: 0,
      completed: 0,
      pending: 0,
      trial: 0,
      refunded: 0,
      replaced: 0
    },
    financial: {
      totalRevenue: 0,
      pendingPayments: 0,
      thisMonthRevenue: 0,
      thisMonthSales: 0,
      totalCommissionPaid: 0
    },
    recentWorkers: [],
    recentSales: [],
    recentSponsors: [],
    totalWorkersSupplied: 0,
    totalAssignments: 0,
    activeAssignments: 0,
    onTrial: 0,
    returned: 0,
    refunded: 0
  };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private agentService: AgentService,
    private workerService: WorkerService,
    private salesService: SalesService,
    private sponsorService: SponsorService,
    private employeeService: EmployeeService,
    private accountsFinanceService: AccountsFinanceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadDashboardData();
      }
    });
  }

  private loadDashboardData() {
    this.isLoading = true;
    
    if (this.isAgent && this.currentUser?.agentId) {
      // Load agent-specific dashboard data
      this.loadAgentDashboardData();
    } else if (this.isEmployee && this.currentUser?.employeeRole === 'Accountant') {
      // Load accountant-specific dashboard data
      this.loadAccountantDashboardData();
    } else if (this.isEmployee && this.currentUser?.employeeRole === 'Receptionist') {
      // Load receptionist-specific dashboard data
      this.loadReceptionistDashboardData();
    } else if (this.isEmployee && this.currentUser?.employeeRole === 'HR Manager') {
      // Load HR Manager-specific dashboard data
      this.loadHRManagerDashboardData();
    } else if (this.isEmployee && this.currentUser?.employeeRole === 'Operations Manager') {
      // Load Operations Manager-specific dashboard data
      this.loadOperationsManagerDashboardData();
    } else {
      // Load admin dashboard data
      this.loadAdminDashboardData();
    }
  }

  private loadAdminDashboardData() {
    // Get all statistics for admin
    const agentStats = this.agentService.getAgentStats();
    const workerStats = this.workerService.getWorkerStats();
    const salesStats = this.salesService.getSalesStats();
    const sponsorStats = this.sponsorService.getStats();
    
    // Get recent data
    const recentWorkers = this.workerService.getAllWorkers().slice(-5);
    const recentSales = this.salesService.getAllSales().slice(-5);
    
    this.dashboardData = {
      // Key Metrics
      totalAgents: agentStats.totalAgents,
      activeAgents: agentStats.activeAgents,
      totalWorkers: workerStats.total,
      availableWorkers: workerStats.available,
      placedWorkers: workerStats.placed,
      totalSponsors: sponsorStats.totalSponsors,
      activeSponsors: sponsorStats.activeSponsors,
      totalSales: salesStats.totalSales,
      totalRevenue: salesStats.totalRevenue,
      pendingPayments: salesStats.pendingPayments,
      
      // Worker Status Breakdown
      workerStatus: {
        available: workerStats.available,
        interview: workerStats.interview,
        trial: workerStats.trial,
        placed: workerStats.placed,
        returned: workerStats.returned,
        absconded: workerStats.absconded
      },
      
      // Sales Status Breakdown
      salesStatus: {
        active: salesStats.activeSales,
        completed: salesStats.completedSales,
        pending: salesStats.pendingSales,
        trial: salesStats.trialPeriodSales,
        refunded: salesStats.refundedSales,
        replaced: salesStats.replacedSales
      },
      
      // Financial Overview
      financial: {
        totalRevenue: salesStats.totalRevenue,
        pendingPayments: salesStats.pendingPayments,
        thisMonthRevenue: salesStats.thisMonthRevenue,
        thisMonthSales: salesStats.thisMonthSales,
        totalCommissionPaid: agentStats.totalCommissionPaid
      },
      
      // Recent Activities
      recentWorkers: recentWorkers,
      recentSales: recentSales,
      
      // Quick Stats
      totalWorkersSupplied: agentStats.totalWorkersSupplied,
      totalAssignments: sponsorStats.totalAssignments,
      activeAssignments: sponsorStats.activeAssignments,
      onTrial: sponsorStats.onTrial,
      returned: sponsorStats.returned,
      refunded: sponsorStats.refunded
    };
    
    this.isLoading = false;
  }

  private loadAgentDashboardData() {
    // Get agent-specific data
    const agent = this.agentService.getAgentById(this.currentUser!.agentId!);
    const agentWorkers = this.workerService.getWorkersByAgent(this.currentUser!.agentId!);
    const agentSales = this.salesService.getSalesByAgent(this.currentUser!.agentId!);
    
    // Calculate agent-specific statistics based on actual workers
    const workerStats = this.workerService.getWorkerStats(); // This already filters by agent
    
    // Calculate commission based on actual sales data
    const totalCommissionFromSales = agentSales.reduce((sum, sale) => sum + (sale.agentCommission || 0), 0);
    
    // Calculate revenue from actual sales
    const totalRevenue = agentSales.reduce((sum, sale) => sum + (sale.paidAmount || 0), 0);
    const pendingPayments = agentSales
      .filter(sale => sale.paymentStatus === 'advance-paid')
      .reduce((sum, sale) => sum + sale.remainingAmount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthSales = agentSales.filter(sale => {
      const saleDate = new Date(sale.createdDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).length;
    
    const thisMonthRevenue = agentSales
      .filter(sale => {
        const saleDate = new Date(sale.createdDate);
        return saleDate.getMonth() === currentMonth && 
               saleDate.getFullYear() === currentYear && 
               sale.status === 'confirmed';
      })
      .reduce((sum, sale) => sum + (sale.paidAmount || 0), 0);
    
    // Calculate average commission per worker based on actual data
    const placedWorkers = agentWorkers.filter(w => w.currentStatus === 'placed').length;
    const averageCommissionPerWorker = placedWorkers > 0 ? 
      totalCommissionFromSales / placedWorkers : 0;
    
    this.dashboardData = {
      // Agent Info
      agentInfo: agent,
      
      // Key Metrics (Agent-specific based on actual workers)
      totalWorkers: workerStats.total,
      availableWorkers: workerStats.available,
      placedWorkers: workerStats.placed,
      totalSales: agentSales.length,
      totalRevenue: totalRevenue,
      pendingPayments: pendingPayments,
      totalCommissionEarned: totalCommissionFromSales, // Use actual commission from sales
      
      // Worker Status Breakdown (Agent-specific)
      workerStatus: {
        available: workerStats.available,
        interview: workerStats.interview,
        trial: workerStats.trial,
        placed: workerStats.placed,
        returned: workerStats.returned,
        absconded: workerStats.absconded
      },
      
      // Sales Status Breakdown (Agent-specific)
      salesStatus: {
        active: agentSales.filter(s => s.status === 'trial' || s.status === 'confirmed').length,
        completed: agentSales.filter(s => s.status === 'confirmed').length,
        pending: agentSales.filter(s => s.status === 'quotation').length,
        trial: agentSales.filter(s => s.status === 'trial').length,
        refunded: agentSales.filter(s => s.status === 'refunded').length,
        replaced: agentSales.filter(s => s.status === 'replaced').length
      },
      
      // Financial Overview (Agent-specific)
      financial: {
        totalRevenue: totalRevenue,
        pendingPayments: pendingPayments,
        thisMonthRevenue: thisMonthRevenue,
        thisMonthSales: thisMonthSales,
        totalCommissionPaid: totalCommissionFromSales // Use actual commission
      },
      
      // Recent Activities (Agent-specific)
      recentWorkers: agentWorkers.slice(-5),
      recentSales: agentSales.slice(-5),
      
      // Agent-specific stats based on actual data
      workersSupplied: agentWorkers.length, // Actual number of workers
      averageCommissionPerWorker: averageCommissionPerWorker
    };
    
    this.isLoading = false;
  }

  private loadAccountantDashboardData() {
    // Get financial data for accountant dashboard
    const financialSummary = this.accountsFinanceService.getFinancialSummary();
    const expenses = this.accountsFinanceService.getBusinessExpenses();
    const commissions = this.accountsFinanceService.getAgentCommissions();
    const creditDebitNotes = this.accountsFinanceService.getCreditDebitNotes();
    
    // Get recent data for accountant
    const recentExpenses = expenses.slice(-5);
    const recentCommissions = commissions.slice(-5);
    const recentNotes = creditDebitNotes.slice(-5);
    
    this.dashboardData = {
      // Financial Overview
      financial: {
        totalRevenue: financialSummary.totalRevenue,
        totalExpenses: financialSummary.totalExpenses,
        netProfit: financialSummary.netProfit,
        commissionPaid: financialSummary.commissionPaid,
        pendingCommissions: financialSummary.pendingCommissions,
        totalRefunds: financialSummary.totalRefunds,
        pendingRefunds: financialSummary.pendingRefunds
      },
      
      // Expense Summary
      expenses: {
        total: expenses.length,
        approved: expenses.filter(e => e.status === 'approved').length,
        pending: expenses.filter(e => e.status === 'pending').length,
        totalAmount: expenses
          .filter(e => e.status === 'approved')
          .reduce((sum, e) => sum + e.amount, 0),
        thisMonthAmount: expenses
          .filter(e => {
            const expenseDate = new Date(e.date);
            const currentDate = new Date();
            return expenseDate.getMonth() === currentDate.getMonth() && 
                   expenseDate.getFullYear() === currentDate.getFullYear() &&
                   e.status === 'approved';
          })
          .reduce((sum, e) => sum + e.amount, 0)
      },
      
      // Commission Summary
      commissions: {
        total: commissions.length,
        paid: commissions.filter(c => c.status === 'paid').length,
        pending: commissions.filter(c => c.status === 'pending').length,
        totalAmount: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
        paidAmount: commissions
          .filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + c.commissionAmount, 0),
        pendingAmount: commissions
          .filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + c.commissionAmount, 0)
      },
      
      // Credit/Debit Notes Summary
      creditDebitNotes: {
        total: creditDebitNotes.length,
        credit: creditDebitNotes.filter(n => n.type === 'credit').length,
        debit: creditDebitNotes.filter(n => n.type === 'debit').length,
        processed: creditDebitNotes.filter(n => n.status === 'processed').length,
        pending: creditDebitNotes.filter(n => n.status === 'issued').length,
        draft: creditDebitNotes.filter(n => n.status === 'draft').length,
        totalRefundAmount: creditDebitNotes
          .filter(n => n.status === 'processed')
          .reduce((sum, n) => sum + n.refundAmount, 0),
        pendingRefundAmount: creditDebitNotes
          .filter(n => n.status === 'issued')
          .reduce((sum, n) => sum + n.refundAmount, 0)
      },
      
      // Recent Activities
      recentExpenses: recentExpenses,
      recentCommissions: recentCommissions,
      recentNotes: recentNotes,
      
      // Monthly Data
      monthlyRevenue: financialSummary.monthlyRevenue,
      monthlyExpenses: financialSummary.monthlyExpenses,
      topExpenseCategories: financialSummary.topExpenseCategories,
      agentCommissionSummary: financialSummary.agentCommissionSummary
    };
    
    this.isLoading = false;
  }

  private loadReceptionistDashboardData() {
    // Get worker and sponsor statistics for receptionist
    const workerStats = this.workerService.getWorkerStats();
    const sponsorStats = this.sponsorService.getStats();
    
    // Get recent data for receptionist
    const recentWorkers = this.workerService.getAllWorkers().slice(-5);
    const recentSponsors: any[] = []; // Initialize empty array
    
    // Get sponsors data
    this.sponsorService.getSponsors().subscribe(sponsors => {
      const recentSponsorsData = sponsors.slice(-5);
      this.dashboardData.recentSponsors = recentSponsorsData;
    });
    
    this.dashboardData = {
      // Key Metrics
      totalWorkers: workerStats.total,
      availableWorkers: workerStats.available,
      placedWorkers: workerStats.placed,
      totalSponsors: sponsorStats.totalSponsors,
      activeSponsors: sponsorStats.activeSponsors,
      
      // Worker Status Breakdown
      workerStatus: {
        available: workerStats.available,
        interview: workerStats.interview,
        trial: workerStats.trial,
        placed: workerStats.placed,
        returned: workerStats.returned,
        absconded: workerStats.absconded
      },
      
      // Sponsor Status Breakdown
      sponsorStatus: {
        active: sponsorStats.activeSponsors,
        inactive: sponsorStats.totalSponsors - sponsorStats.activeSponsors,
        totalAssignments: sponsorStats.totalAssignments,
        activeAssignments: sponsorStats.activeAssignments,
        onTrial: sponsorStats.onTrial,
        returned: sponsorStats.returned
      },
      
      // Financial data (empty for receptionist)
      financial: {
        totalRevenue: 0,
        pendingPayments: 0,
        totalCommissionPaid: 0,
        thisMonthSales: 0,
        thisMonthRevenue: 0,
        totalExpenses: 0,
        pendingCommissions: 0,
        commissionPaid: 0
      },
      
      // Recent Activities
      recentWorkers: recentWorkers,
      recentSponsors: recentSponsors, // Will be updated by subscription
      
      // Quick Stats
      totalWorkersSupplied: workerStats.total,
      totalAssignments: sponsorStats.totalAssignments,
      activeAssignments: sponsorStats.activeAssignments,
      onTrial: sponsorStats.onTrial,
      returned: sponsorStats.returned
    };
    
    this.isLoading = false;
  }

  private loadHRManagerDashboardData() {
    // Get employee statistics for HR Manager
    const employeeStats = this.employeeService.getStats();
    
    // Get all employees data
    this.employeeService.getEmployees().subscribe(employees => {
      const recentEmployees = employees.slice(-5);
      
      this.dashboardData = {
        // Key Metrics for HR Manager
        totalEmployees: employeeStats.totalEmployees,
        activeEmployees: employeeStats.activeEmployees,
        inactiveEmployees: employeeStats.inactiveEmployees,
        onLeaveEmployees: employeeStats.onLeave,
        
        // Employee Role Breakdown
        employeeRoleBreakdown: {
          receptionist: employeeStats.byRole.receptionist,
          hrManager: employeeStats.byRole.hrManager,
          accountant: employeeStats.byRole.accountant,
          salesExecutive: employeeStats.byRole.salesExecutive,
          operationsManager: employeeStats.byRole.operationsManager
        },
        
        // Financial data for HR
        financial: {
          totalSalaryExpense: employeeStats.totalSalaryExpense,
          totalRevenue: 0,
          pendingPayments: 0,
          totalCommissionPaid: 0,
          thisMonthSales: 0,
          thisMonthRevenue: 0,
          totalExpenses: employeeStats.totalSalaryExpense,
          pendingCommissions: 0,
          commissionPaid: 0
        },
        
        // Recent Activities
        recentEmployees: recentEmployees,
        
        // HR Specific Stats
        totalWorkersSupplied: 0,
        totalAssignments: 0,
        activeAssignments: 0,
        onTrial: 0,
        returned: 0
      };
      
      this.isLoading = false;
    });
  }

  private loadOperationsManagerDashboardData() {
    // Get worker and sponsor statistics for Operations Manager
    const workerStats = this.workerService.getWorkerStats();
    const sponsorStats = this.sponsorService.getStats();
    const salesStats = this.salesService.getSalesStats();
    
    // Get recent data for Operations Manager
    const recentWorkers = this.workerService.getAllWorkers().slice(-5);
    const recentSales = this.salesService.getAllSales().slice(-5);
    
    // Calculate total commission paid from actual sales data
    const totalCommissionPaid = recentSales.reduce((sum, sale) => sum + (sale.agentCommission || 0), 0);
    
    // Get sponsors data
    this.sponsorService.getSponsors().subscribe(sponsors => {
      const recentSponsors = sponsors.slice(-5);
      
      this.dashboardData = {
        // Key Metrics for Operations Manager
        totalWorkers: workerStats.total,
        availableWorkers: workerStats.available,
        totalSponsors: sponsorStats.totalSponsors,
        activeSponsors: sponsorStats.activeSponsors,
        totalSales: salesStats.totalSales,
        totalRevenue: salesStats.totalRevenue,
        pendingPayments: salesStats.pendingPayments,
        thisMonthSales: salesStats.thisMonthSales,
        thisMonthRevenue: salesStats.thisMonthRevenue,
        totalCommissionPaid: totalCommissionPaid,
        
        // Recent Activities
        recentWorkers: recentWorkers,
        recentSales: recentSales,
        recentSponsors: recentSponsors,
        
        // Quick Stats
        totalWorkersSupplied: workerStats.total,
        totalAssignments: sponsorStats.totalAssignments,
        activeAssignments: sponsorStats.activeAssignments,
        onTrial: sponsorStats.onTrial,
        returned: sponsorStats.returned,
        refunded: sponsorStats.refunded
      };
      
      this.isLoading = false;
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isAgent(): boolean {
    return this.authService.isAgent();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  get isAccountant(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Accountant';
  }

  get isReceptionist(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Receptionist';
  }

  get isHRManager(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'HR Manager';
  }

  get isOperationsManager(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Operations Manager';
  }

  get employeeRole(): string {
    return this.currentUser?.employeeRole || '';
  }

  formatCurrency(amount: number): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'AED 0';
    }
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'available': 'bg-green-100 text-green-800',
      'interview': 'bg-blue-100 text-blue-800',
      'trial': 'bg-yellow-100 text-yellow-800',
      'placed': 'bg-green-100 text-green-800',
      'returned': 'bg-red-100 text-red-800',
      'absconded': 'bg-red-100 text-red-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'refunded': 'bg-red-100 text-red-800',
      'replaced': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
