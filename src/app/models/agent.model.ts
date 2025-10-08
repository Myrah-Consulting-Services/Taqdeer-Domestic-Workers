export interface Agent {
  id: string;
  agentCode: string;
  agentName: string;
  companyName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  country: string;
  city?: string;
  address?: string;
  commissionType: 'fixed' | 'percentage';
  commissionValue: number;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  status: 'active' | 'inactive';
  registrationDate: Date;
  totalWorkersSupplied: number;
  totalCommissionPaid: number;
  notes?: string;
}

export interface AgentFormData {
  agentCode: string;
  agentName: string;
  companyName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  country: string;
  city?: string;
  address?: string;
  commissionType: 'fixed' | 'percentage';
  commissionValue: number;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  status: 'active' | 'inactive';
  notes?: string;
}




