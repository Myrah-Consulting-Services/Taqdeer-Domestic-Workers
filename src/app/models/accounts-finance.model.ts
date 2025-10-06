// Accounts & Finance Data Models

export interface BusinessExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  vendor: string;
  receiptNumber?: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdDate: string;
  lastUpdated: string;
}

export interface AgentCommission {
  id: string;
  agentId: string;
  agentName: string;
  saleId: string;
  saleCode: string;
  workerName: string;
  sponsorName: string;
  totalSaleAmount: number;
  commissionRate: number; // percentage
  commissionAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  referenceNumber?: string;
  createdDate: string;
  lastUpdated: string;
}

export interface CreditDebitNote {
  id: string;
  type: 'credit' | 'debit';
  noteNumber: string;
  date: string;
  relatedSaleId: string;
  saleCode: string;
  sponsorName: string;
  workerName: string;
  reason: RefundReason;
  originalAmount: number;
  refundAmount: number;
  status: 'draft' | 'issued' | 'processed' | 'cancelled';
  approvedBy?: string;
  processedDate?: string;
  notes?: string;
  createdDate: string;
  lastUpdated: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalCommissions: number;
  pendingCommissions: number;
  totalRefunds: number;
  pendingRefunds: number;
  monthlyRevenue: MonthlyData[];
  monthlyExpenses: MonthlyData[];
  topExpenseCategories: CategorySummary[];
  agentCommissionSummary: AgentSummary[];
}

export interface MonthlyData {
  month: string;
  year: number;
  amount: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface AgentSummary {
  agentId: string;
  agentName: string;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  salesCount: number;
}

// Enums
export type ExpenseCategory = 
  | 'office-rent'
  | 'utilities'
  | 'staff-salaries'
  | 'marketing'
  | 'transportation'
  | 'office-supplies'
  | 'professional-services'
  | 'insurance'
  | 'maintenance'
  | 'telecommunications'
  | 'training'
  | 'other';

export type PaymentMethod = 
  | 'cash'
  | 'bank-transfer'
  | 'cheque'
  | 'credit-card'
  | 'debit-card';

export type RefundReason = 
  | 'worker-returned-trial'
  | 'worker-returned-after-trial'
  | 'worker-absconded'
  | 'worker-illness'
  | 'worker-pregnancy'
  | 'sponsor-cancellation'
  | 'contract-violation'
  | 'other';

// Mock Data Constants
export const EXPENSE_CATEGORIES: { [key in ExpenseCategory]: string } = {
  'office-rent': 'Office Rent',
  'utilities': 'Utilities (Electricity, Water, Gas)',
  'staff-salaries': 'Staff Salaries',
  'marketing': 'Marketing & Advertising',
  'transportation': 'Transportation & Travel',
  'office-supplies': 'Office Supplies',
  'professional-services': 'Professional Services',
  'insurance': 'Insurance',
  'maintenance': 'Maintenance & Repairs',
  'telecommunications': 'Telecommunications',
  'training': 'Training & Development',
  'other': 'Other Expenses'
};

export const REFUND_REASONS: { [key in RefundReason]: string } = {
  'worker-returned-trial': 'Worker Returned During Trial Period',
  'worker-returned-after-trial': 'Worker Returned After Trial Period',
  'worker-absconded': 'Worker Absconded',
  'worker-illness': 'Worker Illness',
  'worker-pregnancy': 'Worker Pregnancy',
  'sponsor-cancellation': 'Sponsor Cancellation',
  'contract-violation': 'Contract Violation',
  'other': 'Other Reason'
};

