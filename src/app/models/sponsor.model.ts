export interface Sponsor {
  id: string;
  sponsorCode: string;
  fullName: string;
  emiratesId: string;
  nationality: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  emirates: string; // Abu Dhabi, Dubai, Sharjah, etc.
  area: string;
  address: string;
  status: 'active' | 'inactive';
  totalHired: number;
  currentWorkers: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerAssignment {
  id: string;
  workerId: string;
  workerName: string;
  workerPassport: string;
  workerNationality: string;
  workerType: string;
  sponsorId: string;
  sponsorName: string;
  
  // Payment Details
  totalAmount: number; // Based on nationality
  advanceAmount: number;
  remainingAmount: number;
  paidAmount: number;
  
  // Contract Details
  contractStartDate: string;
  contractEndDate: string; // 2 years from start
  contractStatus: 'trial' | 'confirmed' | 'completed' | 'terminated';
  
  // Trial Period
  trialStartDate?: string;
  trialEndDate?: string;
  isOnTrial: boolean;
  
  // Status Tracking
  assignmentStatus: 'pending' | 'on-trial' | 'active' | 'returned' | 'replaced' | 'refunded';
  
  // Return/Replacement/Refund
  returnDate?: string;
  returnReason?: string;
  replacementWorkerId?: string;
  refundAmount?: number;
  refundReason?: 'performance' | 'illness' | 'pregnancy' | 'absconded' | 'other';
  refundDate?: string;
  
  // Invoice
  invoiceNumber?: string;
  invoiceDate?: string;
  quotationNumber?: string;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  id: string;
  assignmentId: string;
  sponsorId: string;
  workerId: string;
  amount: number;
  paymentType: 'advance' | 'final' | 'refund';
  paymentMethod: 'cash' | 'card' | 'bank-transfer';
  paymentDate: string;
  reference?: string;
  notes?: string;
}

export interface WorkerInterview {
  id: string;
  sponsorId: string;
  sponsorName: string;
  workerId: string;
  workerName: string;
  workerPassport: string;
  workerNationality: string;
  workerType: string;
  
  // Interview Details
  interviewDate: string;
  interviewTime: string;
  interviewLocation?: string;
  interviewStatus: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  
  // Interview Result
  result?: 'selected' | 'rejected' | 'pending';
  rejectionReason?: string;
  
  // Notes
  interviewNotes?: string;
  sponsorFeedback?: string;
  
  // System Fields
  createdAt: string;
  updatedAt: string;
}

// Nationality-based pricing
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
