export interface Lead {
  id: string;
  leadNumber: string; // Auto-generated: LD001, LD002, etc.
  
  // Contact Information
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  
  // Location
  emirates: string; // Abu Dhabi, Dubai, Sharjah, etc.
  area: string;
  address?: string;
  
  // Requirements
  workerType: string; // Housemaid, Cook, Nanny, Driver, etc.
  preferredNationality?: string;
  numberOfWorkers: number;
  urgencyLevel: 'high' | 'medium' | 'low';
  
  // Budget
  budgetRange?: string; // e.g., "5000-10000 AED"
  
  // Lead Status
  status: 'new' | 'contacted' | 'interested' | 'negotiation' | 'converted' | 'lost';
  source: 'phone-call' | 'walk-in' | 'referral' | 'website' | 'social-media' | 'other';
  
  // Follow-up
  nextFollowUpDate?: string;
  lastContactDate?: string;
  
  // Additional Information
  notes?: string;
  requirements?: string;
  
  // Conversion
  isConverted: boolean;
  convertedToSponsorId?: string;
  convertedDate?: string;
  
  // Assignment
  assignedTo?: string; // Employee ID
  assignedToName?: string; // Employee Name
  
  // System Fields
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // Employee who created the lead
}

export interface LeadActivity {
  id: string;
  leadId: string;
  activityType: 'call' | 'meeting' | 'email' | 'note' | 'status-change';
  description: string;
  performedBy: string;
  performedByName: string;
  activityDate: string;
  nextAction?: string;
}






