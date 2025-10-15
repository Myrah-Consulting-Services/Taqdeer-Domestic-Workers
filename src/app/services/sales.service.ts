import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sale, SalesStats, QuotationData, InvoiceData, RefundCalculation, WORKER_PRICING, ADVANCE_PAYMENT_PERCENTAGE, CONTRACT_DURATION, TRIAL_PERIOD } from '../models/sales.model';
import { SponsorService } from './sponsor.service';
import { WorkerAssignment } from '../models/sponsor.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private salesSubject = new BehaviorSubject<Sale[]>([]);
  public sales$ = this.salesSubject.asObservable();
  
  private sales: Sale[] = [
    {
      id: 'SAL001',
      saleCode: 'SAL001',
      workerId: '1',
      workerName: 'Fatima Hassan',
      workerPassport: 'ET1234567',
      workerNationality: 'Ethiopia',
      workerType: 'housemaid',
      sponsorId: 'S001',
      sponsorName: 'Ahmed Mohammed Al Maktoum',
      sponsorEmirates: 'Dubai',
      sponsorPhone: '+971501234567',
      sponsorEmail: 'ahmed@example.com',
      agentId: '1',
      agentName: 'Global Recruitment Services',
      agentCommission: 500,
      interviewDate: '2024-01-15',
      interviewResult: 'selected',
      selectionDate: '2024-01-15',
      trialStartDate: '2024-01-16',
      trialEndDate: '2024-01-23',
      isOnTrial: false,
      trialStatus: 'completed',
      totalAmount: 5000,
      advanceAmount: 5000,
      remainingAmount: 0,
      paidAmount: 5000,
      paymentStatus: 'fully-paid',
      advancePaymentDate: '2024-01-15',
      advancePaymentMethod: 'bank-transfer',
      finalPaymentDate: '2024-01-20',
      finalPaymentMethod: 'bank-transfer',
      quotationNumber: 'QUO-2024-001',
      quotationDate: '2024-01-15',
      invoiceNumber: 'INV-2024-001',
      invoiceDate: '2024-01-20',
      contractStartDate: '2024-01-20',
      contractEndDate: '2026-01-20',
      contractDuration: 24,
      monthsWorked: 2,
      status: 'confirmed',
      salesPersonId: 'agent001',
      salesPersonName: 'Ahmed Hassan',
      createdBy: 'agent001',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'SAL002',
      saleCode: 'SAL002',
      workerId: '2',
      workerName: 'Maria Santos',
      workerPassport: 'PH9876543',
      workerNationality: 'Philippines',
      workerType: 'cook',
      sponsorId: 'S002',
      sponsorName: 'Ahmed Al Maktoum',
      sponsorEmirates: 'Dubai',
      sponsorPhone: '+971501111111',
      agentId: '2',
      agentName: 'Asia Pacific Manpower',
      agentCommission: 960,
      interviewDate: '2024-01-10',
      interviewResult: 'selected',
      selectionDate: '2024-01-10',
      trialStartDate: '2024-01-12',
      trialEndDate: '2024-01-19',
      isOnTrial: false,
      trialStatus: 'completed',
      totalAmount: 12000,
      advanceAmount: 6000,
      remainingAmount: 0,
      paidAmount: 12000,
      paymentStatus: 'fully-paid',
      advancePaymentDate: '2024-01-10',
      advancePaymentMethod: 'cash',
      finalPaymentDate: '2024-01-20',
      finalPaymentMethod: 'bank-transfer',
      quotationNumber: 'QUO-2024-002',
      quotationDate: '2024-01-10',
      invoiceNumber: 'INV-2024-002',
      invoiceDate: '2024-01-20',
      contractStartDate: '2024-01-20',
      contractEndDate: '2026-01-20',
      contractDuration: 24,
      status: 'confirmed',
      salesPersonId: 'agent002',
      salesPersonName: 'Priya Sharma',
      createdBy: 'agent002',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'SAL003',
      saleCode: 'SAL003',
      workerId: '3',
      workerName: 'Lakshmi Perera',
      workerPassport: 'LK7654321',
      workerNationality: 'Sri Lanka',
      workerType: 'housemaid',
      sponsorId: 'S003',
      sponsorName: 'Fatima Al Nahyan',
      sponsorEmirates: 'Abu Dhabi',
      sponsorPhone: '+971502222222',
      agentId: '3',
      agentName: 'East Africa Recruitment',
      agentCommission: 450,
      interviewDate: '2024-01-25',
      interviewResult: 'selected',
      selectionDate: '2024-01-25',
      trialStartDate: '2024-01-28',
      trialEndDate: '2024-02-04',
      isOnTrial: true,
      trialStatus: 'ongoing',
      totalAmount: 15000,
      advanceAmount: 7500,
      remainingAmount: 7500,
      paidAmount: 7500,
      paymentStatus: 'advance-paid',
      advancePaymentDate: '2024-01-25',
      advancePaymentMethod: 'card',
      quotationNumber: 'QUO-2024-003',
      quotationDate: '2024-01-25',
      contractDuration: 24,
      status: 'trial',
      salesPersonId: 'agent003',
      salesPersonName: 'Mohammed Ali',
      createdBy: 'agent003',
      createdDate: '2024-01-25',
      lastUpdated: '2024-01-28'
    }
  ];

  constructor(private sponsorService: SponsorService) {
    // Sync sales with sponsor assignments
    this.syncSalesWithAssignments();
  }

  // Sync sales data from sponsor-worker assignments
  private syncSalesWithAssignments(): void {
    this.sponsorService.getAssignments().subscribe(assignments => {
      // Convert assignments to sales
      const syncedSales: Sale[] = assignments.map((assignment, index) => this.convertAssignmentToSale(assignment, index));
      
      // Merge with existing sales that don't have assignment mapping
      this.sales = [...syncedSales];
      this.salesSubject.next([...this.sales]);
    });
  }

  // Convert WorkerAssignment to Sale format
  private convertAssignmentToSale(assignment: WorkerAssignment, index: number): Sale {
    let salesStatus: any = 'quotation';
    if (assignment.assignmentStatus === 'on-trial') {
      salesStatus = 'trial';
    } else if (assignment.assignmentStatus === 'active') {
      salesStatus = 'confirmed';
    } else if (assignment.assignmentStatus === 'refunded') {
      salesStatus = 'refunded';
    } else if (assignment.assignmentStatus === 'replaced') {
      salesStatus = 'replaced';
    } else if (assignment.assignmentStatus === 'returned') {
      salesStatus = 'cancelled';
    }

    let paymentStatus: any = 'pending';
    if (assignment.paidAmount >= assignment.totalAmount) {
      paymentStatus = 'fully-paid';
    } else if (assignment.paidAmount > 0) {
      paymentStatus = 'advance-paid';
    }
    if (assignment.assignmentStatus === 'refunded') {
      paymentStatus = 'refunded';
    }

    return {
      id: `SAL${String(parseInt(assignment.id) + 100).padStart(3, '0')}`,
      saleCode: `SAL${String(parseInt(assignment.id) + 100).padStart(3, '0')}`,
      workerId: assignment.workerId,
      workerName: assignment.workerName,
      workerPassport: assignment.workerPassport,
      workerNationality: assignment.workerNationality,
      workerType: assignment.workerType,
      sponsorId: assignment.sponsorId,
      sponsorName: assignment.sponsorName,
      sponsorEmirates: '',
      sponsorPhone: '',
      isOnTrial: assignment.isOnTrial,
      trialStatus: assignment.isOnTrial ? 'ongoing' : 'completed',
      trialStartDate: assignment.trialStartDate,
      trialEndDate: assignment.trialEndDate,
      totalAmount: assignment.totalAmount,
      advanceAmount: assignment.advanceAmount,
      remainingAmount: assignment.remainingAmount,
      paidAmount: assignment.paidAmount,
      paymentStatus: paymentStatus,
      quotationNumber: assignment.quotationNumber,
      quotationDate: assignment.createdAt.split('T')[0],
      invoiceNumber: assignment.invoiceNumber,
      invoiceDate: assignment.invoiceDate,
      contractStartDate: assignment.contractStartDate,
      contractEndDate: assignment.contractEndDate,
      contractDuration: 24,
      monthsWorked: this.calculateMonthsWorked(assignment.contractStartDate),
      status: salesStatus,
      returnDate: assignment.returnDate,
      returnReason: assignment.returnReason,
      refundAmount: assignment.refundAmount,
      refundReason: assignment.refundReason as any,
      refundDate: assignment.refundDate,
      replacementWorkerId: assignment.replacementWorkerId,
      notes: assignment.notes,
      salesPersonId: 'system',
      salesPersonName: 'System',
      createdBy: 'system',
      createdDate: assignment.createdAt,
      lastUpdated: assignment.updatedAt
    };
  }

  private calculateMonthsWorked(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30);
  }

  // Get all sales
  getAllSales(): Sale[] {
    // Re-sync to get latest data
    this.syncSalesWithAssignments();
    return this.sales;
  }

  // Get sales as observable
  getSales(): Observable<Sale[]> {
    this.syncSalesWithAssignments();
    return this.sales$;
  }

  // Get sale by ID
  getSaleById(id: string): Sale | undefined {
    return this.sales.find(sale => sale.id === id);
  }

  // Get sales by agent ID
  getSalesByAgent(agentId: string): Sale[] {
    return this.sales.filter(sale => sale.agentId === agentId);
  }

  // Get sales statistics
  getSalesStats(): SalesStats {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const stats: SalesStats = {
      totalSales: this.sales.length,
      activeSales: this.sales.filter(s => s.status === 'trial' || s.status === 'confirmed').length,
      completedSales: this.sales.filter(s => s.status === 'confirmed').length,
      pendingSales: this.sales.filter(s => s.status === 'quotation').length,
      trialPeriodSales: this.sales.filter(s => s.status === 'trial').length,
      refundedSales: this.sales.filter(s => s.status === 'refunded').length,
      replacedSales: this.sales.filter(s => s.status === 'replaced').length,
      totalRevenue: this.sales
        .filter(s => s.status === 'confirmed')
        .reduce((sum, s) => sum + s.paidAmount, 0),
      pendingPayments: this.sales
        .filter(s => s.paymentStatus === 'advance-paid')
        .reduce((sum, s) => sum + s.remainingAmount, 0),
      thisMonthSales: this.sales.filter(s => {
        const saleDate = new Date(s.createdDate);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      }).length,
      thisMonthRevenue: this.sales
        .filter(s => {
          const saleDate = new Date(s.createdDate);
          return saleDate.getMonth() === currentMonth && 
                 saleDate.getFullYear() === currentYear && 
                 s.status === 'confirmed';
        })
        .reduce((sum, s) => sum + s.paidAmount, 0)
    };

    return stats;
  }

  // Calculate pricing based on nationality
  calculatePricing(nationality: string): { total: number; advance: number; remaining: number } {
    const total = WORKER_PRICING[nationality] || 10000;
    const advance = Math.round(total * ADVANCE_PAYMENT_PERCENTAGE);
    const remaining = total - advance;

    return { total, advance, remaining };
  }

  // Generate quotation number
  generateQuotationNumber(): string {
    const year = new Date().getFullYear();
    const count = this.sales.length + 1;
    return `QUO-${year}-${String(count).padStart(3, '0')}`;
  }

  // Generate invoice number
  generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const invoiceCount = this.sales.filter(s => s.invoiceNumber).length + 1;
    return `INV-${year}-${String(invoiceCount).padStart(3, '0')}`;
  }

  // Generate sale code
  generateSaleCode(): string {
    const count = this.sales.length + 1;
    return `SAL${String(count).padStart(3, '0')}`;
  }

  // Create new sale (quotation)
  createSale(saleData: Partial<Sale>): Sale {
    const pricing = this.calculatePricing(saleData.workerNationality!);
    
    const newSale: Sale = {
      id: this.generateSaleCode(),
      saleCode: this.generateSaleCode(),
      workerId: saleData.workerId!,
      workerName: saleData.workerName!,
      workerPassport: saleData.workerPassport!,
      workerNationality: saleData.workerNationality!,
      workerType: saleData.workerType!,
      sponsorId: saleData.sponsorId!,
      sponsorName: saleData.sponsorName!,
      sponsorEmirates: saleData.sponsorEmirates!,
      sponsorPhone: saleData.sponsorPhone!,
      sponsorEmail: saleData.sponsorEmail,
      agentId: saleData.agentId,
      agentName: saleData.agentName,
      agentCommission: saleData.agentCommission,
      interviewDate: saleData.interviewDate,
      interviewResult: saleData.interviewResult,
      selectionDate: saleData.selectionDate,
      isOnTrial: false,
      totalAmount: pricing.total,
      advanceAmount: pricing.advance,
      remainingAmount: pricing.remaining,
      paidAmount: 0,
      paymentStatus: 'pending',
      quotationNumber: this.generateQuotationNumber(),
      quotationDate: new Date().toISOString().split('T')[0],
      contractDuration: CONTRACT_DURATION,
      status: 'quotation',
      salesPersonId: saleData.salesPersonId!,
      salesPersonName: saleData.salesPersonName!,
      notes: saleData.notes,
      createdBy: 'current-user',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    this.sales.push(newSale);
    return newSale;
  }

  // Start trial period
  startTrialPeriod(saleId: string, startDate: string): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      const trialEndDate = new Date(startDate);
      trialEndDate.setMonth(trialEndDate.getMonth() + TRIAL_PERIOD);

      sale.trialStartDate = startDate;
      sale.trialEndDate = trialEndDate.toISOString().split('T')[0];
      sale.isOnTrial = true;
      sale.trialStatus = 'ongoing';
      sale.status = 'trial';
      sale.contractStartDate = startDate;
      
      const contractEnd = new Date(startDate);
      contractEnd.setMonth(contractEnd.getMonth() + CONTRACT_DURATION);
      sale.contractEndDate = contractEnd.toISOString().split('T')[0];
      
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Record advance payment
  recordAdvancePayment(saleId: string, amount: number, method: 'cash' | 'card' | 'bank-transfer', date: string): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      sale.paidAmount = amount;
      sale.remainingAmount = sale.totalAmount - amount;
      sale.paymentStatus = 'advance-paid';
      sale.advancePaymentDate = date;
      sale.advancePaymentMethod = method;
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Record final payment and generate invoice
  recordFinalPayment(saleId: string, amount: number, method: 'cash' | 'card' | 'bank-transfer', date: string): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      sale.paidAmount += amount;
      sale.remainingAmount = 0;
      sale.paymentStatus = 'fully-paid';
      sale.finalPaymentDate = date;
      sale.finalPaymentMethod = method;
      sale.invoiceNumber = this.generateInvoiceNumber();
      sale.invoiceDate = date;
      sale.status = 'confirmed';
      sale.isOnTrial = false;
      sale.trialStatus = 'completed';
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Calculate refund amount
  calculateRefund(saleId: string, monthsWorked: number, reason: string): RefundCalculation {
    const sale = this.getSaleById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }

    const totalAmount = sale.totalAmount;
    const contractDuration = sale.contractDuration;
    const monthlyRate = totalAmount / contractDuration;
    const amountForWorkedPeriod = monthlyRate * monthsWorked;

    // Full refund cases: illness, pregnancy, absconded
    const isFullRefund = ['illness', 'pregnancy', 'absconded'].includes(reason.toLowerCase());
    
    const refundableAmount = isFullRefund ? totalAmount : (totalAmount - amountForWorkedPeriod);

    return {
      totalAmount,
      contractDuration,
      monthsWorked,
      monthlyRate,
      amountForWorkedPeriod,
      refundableAmount: Math.max(0, refundableAmount),
      refundReason: reason,
      isFullRefund
    };
  }

  // Process refund
  processRefund(saleId: string, refundAmount: number, reason: string, monthsWorked: number): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      sale.status = 'refunded';
      sale.refundAmount = refundAmount;
      sale.refundReason = reason as any;
      sale.refundDate = new Date().toISOString().split('T')[0];
      sale.refundStatus = 'completed';
      sale.monthsWorked = monthsWorked;
      sale.returnDate = new Date().toISOString().split('T')[0];
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Process replacement
  processReplacement(saleId: string, newWorkerId: string, newWorkerName: string): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      sale.status = 'replaced';
      sale.replacementWorkerId = newWorkerId;
      sale.replacementWorkerName = newWorkerName;
      sale.replacementDate = new Date().toISOString().split('T')[0];
      sale.returnDate = new Date().toISOString().split('T')[0];
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Return worker
  returnWorker(saleId: string, reason: string): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      sale.returnDate = new Date().toISOString().split('T')[0];
      sale.returnReason = reason;
      sale.trialStatus = 'returned';
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Cancel sale
  cancelSale(saleId: string): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      sale.status = 'cancelled';
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Update sale
  updateSale(saleId: string, updates: Partial<Sale>): void {
    const sale = this.getSaleById(saleId);
    if (sale) {
      Object.assign(sale, updates);
      sale.lastUpdated = new Date().toISOString();
    }
  }

  // Delete sale
  deleteSale(saleId: string): void {
    const index = this.sales.findIndex(s => s.id === saleId);
    if (index > -1) {
      this.sales.splice(index, 1);
    }
  }
}
