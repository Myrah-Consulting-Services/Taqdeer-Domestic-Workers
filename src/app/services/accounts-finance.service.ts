import { Injectable } from '@angular/core';
import { 
  BusinessExpense, 
  AgentCommission, 
  CreditDebitNote, 
  FinancialSummary,
  ExpenseCategory,
  PaymentMethod,
  RefundReason,
  EXPENSE_CATEGORIES,
  REFUND_REASONS
} from '../models/accounts-finance.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsFinanceService {

  constructor() { }

  // Business Expenses
  getBusinessExpenses(): BusinessExpense[] {
    return [
      {
        id: 'EXP001',
        date: '2024-01-15',
        category: 'office-rent',
        description: 'Monthly office rent - Downtown Dubai',
        amount: 15000,
        paymentMethod: 'bank-transfer',
        vendor: 'Dubai Properties LLC',
        receiptNumber: 'RCP-001-2024',
        approvedBy: 'Ahmed Al Mansouri',
        status: 'approved',
        notes: 'Regular monthly rent payment',
        createdDate: '2024-01-15',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'EXP002',
        date: '2024-01-20',
        category: 'staff-salaries',
        description: 'January 2024 staff salaries',
        amount: 45000,
        paymentMethod: 'bank-transfer',
        vendor: 'Internal',
        approvedBy: 'Ahmed Al Mansouri',
        status: 'approved',
        notes: 'Monthly salary payments for 15 staff members',
        createdDate: '2024-01-20',
        lastUpdated: '2024-01-20'
      },
      {
        id: 'EXP003',
        date: '2024-01-25',
        category: 'utilities',
        description: 'DEWA and Etisalat bills',
        amount: 3200,
        paymentMethod: 'bank-transfer',
        vendor: 'DEWA & Etisalat',
        receiptNumber: 'UTL-001-2024',
        approvedBy: 'Fatima Hassan',
        status: 'approved',
        notes: 'Electricity, water and internet bills',
        createdDate: '2024-01-25',
        lastUpdated: '2024-01-25'
      },
      {
        id: 'EXP004',
        date: '2024-01-28',
        category: 'marketing',
        description: 'Google Ads campaign - Domestic workers',
        amount: 5000,
        paymentMethod: 'credit-card',
        vendor: 'Google LLC',
        approvedBy: 'Ahmed Al Mansouri',
        status: 'pending',
        notes: 'Digital marketing campaign for worker recruitment',
        createdDate: '2024-01-28',
        lastUpdated: '2024-01-28'
      },
      {
        id: 'EXP005',
        date: '2024-01-30',
        category: 'transportation',
        description: 'Airport pickup services',
        amount: 1800,
        paymentMethod: 'cash',
        vendor: 'Dubai Taxi Services',
        approvedBy: 'Maria Santos',
        status: 'approved',
        notes: 'Worker pickup from Dubai Airport',
        createdDate: '2024-01-30',
        lastUpdated: '2024-01-30'
      }
    ];
  }

  getExpenseById(id: string): BusinessExpense | undefined {
    return this.getBusinessExpenses().find(expense => expense.id === id);
  }

  createExpense(expense: Omit<BusinessExpense, 'id' | 'createdDate' | 'lastUpdated'>): BusinessExpense {
    const newExpense: BusinessExpense = {
      ...expense,
      id: `EXP${String(Date.now()).slice(-3)}`,
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // In real app, save to backend
    console.log('Creating expense:', newExpense);
    return newExpense;
  }

  // Agent Commissions
  getAgentCommissions(): AgentCommission[] {
    return [
      {
        id: 'COM001',
        agentId: 'AG001',
        agentName: 'Global Recruitment Services',
        saleId: 'SAL001',
        saleCode: 'SAL001',
        workerName: 'Maria Santos',
        sponsorName: 'Ahmed Al Mansouri',
        totalSaleAmount: 12000,
        commissionRate: 8,
        commissionAmount: 960,
        status: 'paid',
        paymentDate: '2024-01-15',
        paymentMethod: 'bank-transfer',
        referenceNumber: 'TXN-COM-001',
        createdDate: '2024-01-10',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'COM002',
        agentId: 'AG002',
        agentName: 'Asia Pacific Manpower',
        saleId: 'SAL002',
        saleCode: 'SAL002',
        workerName: 'Lakshmi Devi',
        sponsorName: 'Fatima Hassan',
        totalSaleAmount: 12000,
        commissionRate: 10,
        commissionAmount: 1200,
        status: 'pending',
        createdDate: '2024-01-20',
        lastUpdated: '2024-01-20'
      },
      {
        id: 'COM003',
        agentId: 'AG003',
        agentName: 'East Africa Recruitment',
        saleId: 'SAL003',
        saleCode: 'SAL003',
        workerName: 'Amara Bekele',
        sponsorName: 'Khalid Abdullah',
        totalSaleAmount: 5000,
        commissionRate: 12,
        commissionAmount: 600,
        status: 'paid',
        paymentDate: '2024-01-25',
        paymentMethod: 'bank-transfer',
        referenceNumber: 'TXN-COM-003',
        createdDate: '2024-01-22',
        lastUpdated: '2024-01-25'
      }
    ];
  }

  getCommissionById(id: string): AgentCommission | undefined {
    return this.getAgentCommissions().find(commission => commission.id === id);
  }

  payCommission(commissionId: string, paymentDetails: {
    paymentMethod: PaymentMethod;
    referenceNumber?: string;
  }): AgentCommission | undefined {
    const commission = this.getCommissionById(commissionId);
    if (commission) {
      commission.status = 'paid';
      commission.paymentDate = new Date().toISOString();
      commission.paymentMethod = paymentDetails.paymentMethod;
      commission.referenceNumber = paymentDetails.referenceNumber;
      commission.lastUpdated = new Date().toISOString();
    }
    return commission;
  }

  // Credit/Debit Notes
  getCreditDebitNotes(): CreditDebitNote[] {
    return [
      {
        id: 'CDN001',
        type: 'credit',
        noteNumber: 'CN-2024-001',
        date: '2024-01-20',
        relatedSaleId: 'SAL004',
        saleCode: 'SAL004',
        sponsorName: 'Omar Al Rashid',
        workerName: 'Priya Sharma',
        reason: 'worker-returned-trial',
        originalAmount: 12000,
        refundAmount: 12000,
        status: 'processed',
        approvedBy: 'Ahmed Al Mansouri',
        processedDate: '2024-01-22',
        notes: 'Worker returned within 6-month trial period - full refund',
        createdDate: '2024-01-20',
        lastUpdated: '2024-01-22'
      },
      {
        id: 'CDN002',
        type: 'debit',
        noteNumber: 'DN-2024-001',
        date: '2024-01-25',
        relatedSaleId: 'SAL005',
        saleCode: 'SAL005',
        sponsorName: 'Sarah Al Zahra',
        workerName: 'Aisha Mohammed',
        reason: 'worker-absconded',
        originalAmount: 8000,
        refundAmount: 8000,
        status: 'issued',
        approvedBy: 'Fatima Hassan',
        notes: 'Worker absconded after 2 months - full refund required',
        createdDate: '2024-01-25',
        lastUpdated: '2024-01-25'
      },
      {
        id: 'CDN003',
        type: 'credit',
        noteNumber: 'CN-2024-002',
        date: '2024-01-28',
        relatedSaleId: 'SAL006',
        saleCode: 'SAL006',
        sponsorName: 'Hassan Al Suwaidi',
        workerName: 'Lakshmi Perera',
        reason: 'worker-returned-after-trial',
        originalAmount: 15000,
        refundAmount: 12500,
        status: 'draft',
        notes: 'Worker returned after 8 months - proportional refund',
        createdDate: '2024-01-28',
        lastUpdated: '2024-01-28'
      }
    ];
  }

  getCreditDebitNoteById(id: string): CreditDebitNote | undefined {
    return this.getCreditDebitNotes().find(note => note.id === id);
  }

  createCreditDebitNote(note: Omit<CreditDebitNote, 'id' | 'noteNumber' | 'createdDate' | 'lastUpdated'>): CreditDebitNote {
    const noteType = note.type.toUpperCase();
    const noteNumber = `${noteType.slice(0, 2)}-2024-${String(Date.now()).slice(-3)}`;
    
    const newNote: CreditDebitNote = {
      ...note,
      id: `CDN${String(Date.now()).slice(-3)}`,
      noteNumber,
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Creating credit/debit note:', newNote);
    return newNote;
  }

  // Financial Summary
  getFinancialSummary(): FinancialSummary {
    const expenses = this.getBusinessExpenses();
    const commissions = this.getAgentCommissions();
    const notes = this.getCreditDebitNotes();

    const totalExpenses = expenses
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalCommissions = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const pendingCommissions = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const totalRefunds = notes
      .filter(n => n.status === 'processed')
      .reduce((sum, n) => sum + n.refundAmount, 0);

    const pendingRefunds = notes
      .filter(n => n.status === 'issued')
      .reduce((sum, n) => sum + n.refundAmount, 0);

    // Mock revenue calculation (in real app, this would come from sales)
    const totalRevenue = 150000; // Mock data

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses - totalCommissions - totalRefunds,
      totalCommissions,
      pendingCommissions,
      totalRefunds,
      pendingRefunds,
      monthlyRevenue: this.getMonthlyRevenueData(),
      monthlyExpenses: this.getMonthlyExpenseData(),
      topExpenseCategories: this.getTopExpenseCategories(expenses),
      agentCommissionSummary: this.getAgentCommissionSummary(commissions)
    };
  }

  private getMonthlyRevenueData() {
    return [
      { month: 'Jan', year: 2024, amount: 45000 },
      { month: 'Dec', year: 2023, amount: 38000 },
      { month: 'Nov', year: 2023, amount: 42000 },
      { month: 'Oct', year: 2023, amount: 35000 },
      { month: 'Sep', year: 2023, amount: 48000 },
      { month: 'Aug', year: 2023, amount: 41000 }
    ];
  }

  private getMonthlyExpenseData() {
    return [
      { month: 'Jan', year: 2024, amount: 70000 },
      { month: 'Dec', year: 2023, amount: 65000 },
      { month: 'Nov', year: 2023, amount: 68000 },
      { month: 'Oct', year: 2023, amount: 62000 },
      { month: 'Sep', year: 2023, amount: 71000 },
      { month: 'Aug', year: 2023, amount: 66000 }
    ];
  }

  private getTopExpenseCategories(expenses: BusinessExpense[]) {
    const categoryTotals = new Map<ExpenseCategory, number>();
    const categoryCounts = new Map<ExpenseCategory, number>();

    expenses.forEach(expense => {
      if (expense.status === 'approved') {
        categoryTotals.set(expense.category, (categoryTotals.get(expense.category) || 0) + expense.amount);
        categoryCounts.set(expense.category, (categoryCounts.get(expense.category) || 0) + 1);
      }
    });

    const totalAmount = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalAmount) * 100,
        count: categoryCounts.get(category) || 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  private getAgentCommissionSummary(commissions: AgentCommission[]) {
    const agentTotals = new Map<string, {
      agentId: string;
      agentName: string;
      totalCommissions: number;
      pendingCommissions: number;
      paidCommissions: number;
      salesCount: number;
    }>();

    commissions.forEach(commission => {
      if (!agentTotals.has(commission.agentId)) {
        agentTotals.set(commission.agentId, {
          agentId: commission.agentId,
          agentName: commission.agentName,
          totalCommissions: 0,
          pendingCommissions: 0,
          paidCommissions: 0,
          salesCount: 0
        });
      }

      const agent = agentTotals.get(commission.agentId)!;
      agent.totalCommissions += commission.commissionAmount;
      agent.salesCount += 1;

      if (commission.status === 'paid') {
        agent.paidCommissions += commission.commissionAmount;
      } else if (commission.status === 'pending') {
        agent.pendingCommissions += commission.commissionAmount;
      }
    });

    return Array.from(agentTotals.values())
      .sort((a, b) => b.totalCommissions - a.totalCommissions);
  }

  // Utility methods
  getExpenseCategories(): { [key in ExpenseCategory]: string } {
    return EXPENSE_CATEGORIES;
  }

  getRefundReasons(): { [key in RefundReason]: string } {
    return REFUND_REASONS;
  }

  calculateRefundAmount(originalAmount: number, contractMonths: number, workedMonths: number, reason: RefundReason): number {
    if (reason === 'worker-absconded' || reason === 'worker-illness' || reason === 'worker-pregnancy') {
      return originalAmount; // Full refund
    }
    
    if (reason === 'worker-returned-trial') {
      return originalAmount; // Full refund during trial
    }

    // Proportional refund after trial
    const monthlyValue = originalAmount / contractMonths;
    const workedValue = monthlyValue * workedMonths;
    return originalAmount - workedValue;
  }
}

