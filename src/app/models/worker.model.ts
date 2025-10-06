export type WorkerType = 'housemaid' | 'cleaner' | 'cook' | 'babysitter' | 'driver' | 'gardener';

export type WorkerNationality = 'Ethiopia' | 'India' | 'Sri Lanka' | 'Nepal' | 'Philippines' | 'Bangladesh' | 'Indonesia' | 'Kenya' | 'Uganda';

export type WorkerStatus = 'available' | 'interview' | 'trial' | 'placed' | 'returned' | 'absconded';

export type VisaType = 'visit' | 'work' | 'employment';

export interface Worker {
  id: string;
  workerCode: string; // Auto-generated (W001, W002, etc.)
  
  // Personal Information
  fullName: string;
  dateOfBirth: Date;
  age: number;
  nationality: WorkerNationality;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: string;
  photo?: string;
  
  // Passport & Visa Details
  passportNumber: string;
  passportIssueDate: Date;
  passportExpiryDate: Date;
  visaType: VisaType;
  visaNumber?: string;
  visaIssueDate?: Date;
  visaExpiryDate?: Date;
  arrivalDate?: Date;
  
  // Worker Details
  workerType: WorkerType;
  experience: number; // Years of experience
  languages: string[]; // e.g., ['English', 'Arabic', 'Hindi']
  skills: string[]; // Additional skills
  
  // Agent Information
  agentId: string; // Which agent supplied this worker
  agentCode: string;
  agentName: string;
  agentCommission: number; // Commission amount or percentage
  
  // Sponsor Information (if placed)
  sponsorId?: string;
  sponsorName?: string;
  sponsorPhone?: string;
  sponsorEmirates?: string;
  
  // Status & Tracking
  currentStatus: WorkerStatus;
  availableFrom?: Date; // When worker became available
  interviewDate?: Date;
  trialStartDate?: Date;
  trialEndDate?: Date;
  placementDate?: Date; // Final placement date
  contractStartDate?: Date;
  contractEndDate?: Date; // 2 years from start
  returnDate?: Date; // If returned
  returnReason?: string;
  
  // Financial Details
  packageAmount: number; // Based on nationality (AED 5,000 - 15,000)
  advanceReceived: number;
  remainingAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  invoiceNumber?: string;
  
  // Additional Information
  medicalStatus?: 'pending' | 'passed' | 'failed';
  medicalDate?: Date;
  notes?: string;
  
  // System Fields
  createdBy: string; // User who added the worker
  createdDate: Date;
  lastUpdated: Date;
}

export interface WorkerFormData {
  fullName: string;
  dateOfBirth: Date;
  nationality: WorkerNationality;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: string;
  passportNumber: string;
  passportIssueDate: Date;
  passportExpiryDate: Date;
  visaType: VisaType;
  visaNumber?: string;
  visaIssueDate?: Date;
  visaExpiryDate?: Date;
  arrivalDate?: Date;
  workerType: WorkerType;
  experience: number;
  languages: string[];
  skills: string[];
  agentId: string;
  notes?: string;
}

// Nationality-based pricing
export const NationalityPricing: Record<WorkerNationality, number> = {
  'Ethiopia': 5000,
  'India': 12000,
  'Sri Lanka': 15000,
  'Nepal': 14000,
  'Philippines': 12000,
  'Bangladesh': 10000,
  'Indonesia': 11000,
  'Kenya': 8000,
  'Uganda': 7000
};

// Worker type labels
export const WorkerTypeLabels: Record<WorkerType, string> = {
  'housemaid': 'Housemaid',
  'cleaner': 'Cleaner',
  'cook': 'Cook',
  'babysitter': 'Babysitter',
  'driver': 'Driver',
  'gardener': 'Gardener'
};

// Status labels
export const WorkerStatusLabels: Record<WorkerStatus, string> = {
  'available': 'Available',
  'interview': 'Interview Scheduled',
  'trial': 'On Trial',
  'placed': 'Placed',
  'returned': 'Returned',
  'absconded': 'Absconded'
};


