export type SalesStatus = 'quotation' | 'trial' | 'confirmed' | 'refunded' | 'replaced' | 'cancelled';
export type PaymentStatus = 'advance-paid' | 'fully-paid' | 'refunded' | 'pending';

export interface Sale {
  id: string;
  saleCode: string; // SAL001, SAL002, etc.
  
  // Worker Details
  workerId: string;
  workerName: string;
  workerPassport: string;
  workerNationality: string;
  workerType: string; // housemaid, cleaner, cook, babysitter, etc.
  
  // Sponsor Details
  sponsorId: string;
  sponsorName: string;
  sponsorEmirates: string;
  sponsorPhone: string;
  sponsorEmail?: string;
  
  // Agent Details (if worker came through agent)
  agentId?: string;
  agentName?: string;
  agentCommission?: number;
  
  // Interview & Selection
  interviewDate?: string;
  interviewResult?: 'selected' | 'rejected' | 'pending';
  selectionDate?: string;
  
  // Trial Period
  trialStartDate?: string;
  trialEndDate?: string; // Usually 6 months
  isOnTrial: boolean;
  trialStatus?: 'ongoing' | 'completed' | 'returned';
  
  // Pricing (Based on Nationality)
  totalAmount: number; // From Ministry pricing
  advanceAmount: number;
  remainingAmount: number;
  paidAmount: number;
  
  // Payment Details
  paymentStatus: PaymentStatus;
  advancePaymentDate?: string;
  advancePaymentMethod?: 'cash' | 'card' | 'bank-transfer';
  finalPaymentDate?: string;
  finalPaymentMethod?: 'cash' | 'card' | 'bank-transfer';
  
  // Documents
  quotationNumber?: string;
  quotationDate?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  
  // Contract Details
  contractStartDate?: string;
  contractEndDate?: string; // 2 years from start
  contractDuration: number; // 24 months
  monthsWorked?: number;
  
  // Status
  status: SalesStatus;
  
  // Return/Refund/Replacement
  returnDate?: string;
  returnReason?: string;
  refundAmount?: number;
  refundReason?: 'performance' | 'illness' | 'pregnancy' | 'absconded' | 'other';
  refundDate?: string;
  refundStatus?: 'pending' | 'approved' | 'completed';
  
  replacementWorkerId?: string;
  replacementWorkerName?: string;
  replacementDate?: string;
  
  // Notes
  notes?: string;
  
  // Sales Person
  salesPersonId: string;
  salesPersonName: string;
  
  // System Fields
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

export interface SalesStats {
  totalSales: number;
  activeSales: number;
  completedSales: number;
  pendingSales: number;
  trialPeriodSales: number;
  refundedSales: number;
  replacedSales: number;
  totalRevenue: number;
  pendingPayments: number;
  thisMonthSales: number;
  thisMonthRevenue: number;
}

export interface QuotationData {
  quotationNumber: string;
  quotationDate: string;
  sponsorName: string;
  sponsorEmirates: string;
  workerName: string;
  workerType: string;
  workerNationality: string;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  validUntil: string;
  terms: string[];
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  saleId: string;
  sponsorName: string;
  sponsorEmirates: string;
  sponsorPhone: string;
  workerName: string;
  workerPassport: string;
  workerType: string;
  workerNationality: string;
  totalAmount: number;
  advancePaid: number;
  finalPayment: number;
  paymentMethod: string;
  contractStartDate: string;
  contractEndDate: string;
}

export interface RefundCalculation {
  totalAmount: number;
  contractDuration: number; // months
  monthsWorked: number;
  monthlyRate: number;
  amountForWorkedPeriod: number;
  refundableAmount: number;
  refundReason: string;
  isFullRefund: boolean; // For illness, pregnancy, absconded cases
}

// Ministry-defined pricing based on nationality
export const WORKER_PRICING: { [key: string]: number } = {
  'Ethiopia': 5000,
  'India': 12000,
  'Sri Lanka': 15000,
  'Nepal': 14000,
  'Philippines': 12000,
  'Bangladesh': 10000,
  'Indonesia': 11000,
  'Kenya': 8000,
  'Uganda': 8000
};

// Typical advance payment percentages
export const ADVANCE_PAYMENT_PERCENTAGE = 0.5; // 50%

// Contract duration in months
export const CONTRACT_DURATION = 24; // 2 years

// Trial period in months
export const TRIAL_PERIOD = 6; // 6 months

