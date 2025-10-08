import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AgentService } from '../../services/agent.service';
import { WorkerService } from '../../services/worker.service';
import { SalesService } from '../../services/sales.service';
import { SponsorService } from '../../services/sponsor.service';
import { EmployeeService } from '../../services/employee.service';
import { AccountsFinanceService } from '../../services/accounts-finance.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: 'sales' | 'accounts' | 'administration' = 'administration';
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
    private accountsFinanceService: AccountsFinanceService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && this.isAdmin) {
        this.loadDashboardData();
      }
    });
  }

  private loadDashboardData() {
    this.isLoading = true;
    
    // Get all statistics for admin
    const agentStats = this.agentService.getAgentStats();
    const workerStats = this.workerService.getWorkerStats();
    const salesStats = this.salesService.getSalesStats();
    const sponsorStats = this.sponsorService.getStats();
    
    // Get financial data for accounts tab
    const financialSummary = this.accountsFinanceService.getFinancialSummary();
    const expenses = this.accountsFinanceService.getBusinessExpenses();
    const commissions = this.accountsFinanceService.getAgentCommissions();
    const creditDebitNotes = this.accountsFinanceService.getCreditDebitNotes();
    
    // Get recent data
    const recentWorkers = this.workerService.getAllWorkers().slice(-5);
    const recentSales = this.salesService.getAllSales().slice(-5);
    const recentExpenses = expenses.slice(-5);
    const recentCommissions = commissions.slice(-5);
    const recentNotes = creditDebitNotes.slice(-5);
    
    // Get sponsors data
    this.sponsorService.getSponsors().subscribe(sponsors => {
      const recentSponsors = sponsors.slice(-5);
      
      // Get employees data
      this.employeeService.getEmployees().subscribe(employees => {
        const recentEmployees = employees.slice(-5).map((employee, index) => ({
          ...employee,
          // Add salary information for display
          salary: employee.totalSalary,
          // Add some hardcoded salary payment data with realistic amounts and variations
          salaryPaid: employee.totalSalary,
          lastSalaryDate: new Date('2024-01-31'),
          // Add some variation to make it look more realistic
          salaryStatus: 'paid',
          paymentMethod: 'bank-transfer',
          // Add some hardcoded salary payment history
          salaryHistory: [
            {
              month: 'January 2024',
              amount: employee.totalSalary,
              status: 'paid',
              paymentDate: '2024-01-31',
              method: 'bank-transfer'
            },
            {
              month: 'December 2023',
              amount: employee.totalSalary,
              status: 'paid',
              paymentDate: '2023-12-31',
              method: 'bank-transfer'
            }
          ],
          // Add some performance bonuses for certain employees
          bonus: index === 1 || index === 4 ? employee.totalSalary * 0.1 : 0, // 10% bonus for HR Manager and Operations Manager
          totalPaid: employee.totalSalary + (index === 1 || index === 4 ? employee.totalSalary * 0.1 : 0)
        }));
        
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
            thisMonthRevenue: salesStats.thisMonthRevenue,
            thisMonthSales: salesStats.thisMonthSales,
            totalCommissionPaid: agentStats.totalCommissionPaid,
            // Add financial data for accounts tab
            totalExpenses: financialSummary.totalExpenses,
            netProfit: financialSummary.netProfit,
            commissionPaid: financialSummary.commissionPaid,
            pendingCommissions: financialSummary.pendingCommissions,
            totalRefunds: financialSummary.totalRefunds,
            pendingRefunds: financialSummary.pendingRefunds,
            pendingPayments: financialSummary.pendingPayments
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
          recentWorkers: recentWorkers,
          recentSales: recentSales,
          recentSponsors: recentSponsors,
          recentEmployees: recentEmployees,
          recentExpenses: recentExpenses,
          recentCommissions: recentCommissions,
          recentNotes: recentNotes,
          
          // Monthly Data
          monthlyRevenue: financialSummary.monthlyRevenue,
          monthlyExpenses: financialSummary.monthlyExpenses,
          topExpenseCategories: financialSummary.topExpenseCategories,
          agentCommissionSummary: financialSummary.agentCommissionSummary,
          
          // Quick Stats
          totalWorkersSupplied: agentStats.totalWorkersSupplied,
          totalAssignments: sponsorStats.totalAssignments,
          activeAssignments: sponsorStats.activeAssignments,
          onTrial: sponsorStats.onTrial,
          returned: sponsorStats.returned,
          refunded: sponsorStats.refunded,
          
          // Salary Payment Statistics
          salaryStats: {
            totalSalaryPaid: recentEmployees.reduce((sum, emp) => sum + (emp.totalPaid || emp.totalSalary), 0),
            employeesPaid: recentEmployees.length,
            averageSalary: recentEmployees.reduce((sum, emp) => sum + (emp.totalPaid || emp.totalSalary), 0) / recentEmployees.length,
            thisMonthSalary: recentEmployees.reduce((sum, emp) => sum + (emp.totalPaid || emp.totalSalary), 0),
            lastPaymentDate: '2024-01-31'
          }
        };
        
        this.isLoading = false;
      });
    });
  }

  switchTab(tab: 'sales' | 'accounts' | 'administration') {
    this.activeTab = tab;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
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
