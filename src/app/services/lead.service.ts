import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lead, LeadActivity } from '../models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private leads: Lead[] = [
    {
      id: '1',
      leadNumber: 'LD001',
      fullName: 'Khalid Ahmed',
      phone: '+971501234000',
      email: 'khalid.ahmed@email.ae',
      emirates: 'Dubai',
      area: 'Marina',
      address: 'Marina Heights Tower 3',
      workerType: 'Housemaid',
      preferredNationality: 'Ethiopia',
      numberOfWorkers: 1,
      urgencyLevel: 'high',
      budgetRange: '5000-6000 AED',
      status: 'interested',
      source: 'phone-call',
      lastContactDate: '2024-03-10',
      nextFollowUpDate: '2024-03-15',
      notes: 'Looking for experienced housemaid, prefers Ethiopian nationality',
      requirements: 'Cooking, cleaning, and ironing skills required',
      isConverted: false,
      assignedTo: '1',
      assignedToName: 'Sarah Johnson',
      createdAt: '2024-03-08T10:00:00Z',
      updatedAt: '2024-03-10T14:30:00Z',
      createdBy: '1'
    },
    {
      id: '2',
      leadNumber: 'LD002',
      fullName: 'Aisha Hassan',
      phone: '+971509998877',
      alternatePhone: '+97142223344',
      email: 'aisha.h@email.ae',
      emirates: 'Abu Dhabi',
      area: 'Corniche',
      workerType: 'Housemaid',
      preferredNationality: 'Philippines',
      numberOfWorkers: 1,
      urgencyLevel: 'medium',
      budgetRange: '10000-12000 AED',
      status: 'new',
      source: 'referral',
      notes: 'Referred by existing client Ahmed Al Maktoum. Needs housemaid for villa',
      requirements: 'English speaking, experienced with cleaning and laundry, cooking preferred',
      isConverted: false,
      createdAt: '2024-03-12T09:15:00Z',
      updatedAt: '2024-03-12T09:15:00Z',
      createdBy: '2'
    },
    {
      id: '3',
      leadNumber: 'LD003',
      fullName: 'Omar Rashid',
      phone: '+971561234567',
      emirates: 'Sharjah',
      area: 'Al Qasimia',
      workerType: 'Housemaid',
      preferredNationality: 'India',
      numberOfWorkers: 1,
      urgencyLevel: 'low',
      status: 'contacted',
      source: 'walk-in',
      lastContactDate: '2024-03-11',
      nextFollowUpDate: '2024-03-20',
      notes: 'Visited office, needs housemaid for apartment. Will decide after Eid holidays',
      requirements: 'General housework, cleaning, and basic cooking',
      isConverted: false,
      assignedTo: '3',
      assignedToName: 'Mohammed Ali',
      createdAt: '2024-03-11T11:00:00Z',
      updatedAt: '2024-03-11T15:00:00Z',
      createdBy: '3'
    },
    {
      id: '4',
      leadNumber: 'LD004',
      fullName: 'Fatima Abdullah',
      phone: '+971507776655',
      email: 'fatima.a@email.ae',
      emirates: 'Dubai',
      area: 'Jumeirah',
      address: 'Villa 23, Jumeirah 2',
      workerType: 'Housemaid',
      preferredNationality: 'Sri Lanka',
      numberOfWorkers: 1,
      urgencyLevel: 'high',
      budgetRange: '12000-15000 AED',
      status: 'converted',
      source: 'phone-call',
      lastContactDate: '2024-03-13',
      notes: 'Hired Sri Lankan housemaid. Very satisfied with service',
      requirements: 'Expert in cleaning, cooking Asian and Middle Eastern cuisine, ironing',
      isConverted: true,
      convertedToSponsorId: '1',
      convertedDate: '2024-03-13T12:00:00Z',
      assignedTo: '1',
      assignedToName: 'Sarah Johnson',
      createdAt: '2024-03-05T10:00:00Z',
      updatedAt: '2024-03-13T12:00:00Z',
      createdBy: '1'
    }
  ];

  private activities: LeadActivity[] = [
    {
      id: '1',
      leadId: '1',
      activityType: 'call',
      description: 'Initial call - discussed requirements',
      performedBy: '1',
      performedByName: 'Sarah Johnson',
      activityDate: '2024-03-08T10:00:00Z',
      nextAction: 'Send worker profiles'
    },
    {
      id: '2',
      leadId: '1',
      activityType: 'note',
      description: 'Sent 3 Ethiopian housemaid profiles via WhatsApp',
      performedBy: '1',
      performedByName: 'Sarah Johnson',
      activityDate: '2024-03-10T14:30:00Z',
      nextAction: 'Follow up on profile selection'
    }
  ];

  private leadsSubject = new BehaviorSubject<Lead[]>(this.leads);
  private activitiesSubject = new BehaviorSubject<LeadActivity[]>(this.activities);

  leads$ = this.leadsSubject.asObservable();
  activities$ = this.activitiesSubject.asObservable();

  constructor() { }

  // Lead CRUD Operations
  getLeads(): Observable<Lead[]> {
    return this.leads$;
  }

  getLeadById(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  addLead(lead: Lead): void {
    lead.id = (this.leads.length + 1).toString();
    lead.leadNumber = this.generateLeadNumber();
    lead.createdAt = new Date().toISOString();
    lead.updatedAt = new Date().toISOString();
    lead.isConverted = false;
    lead.status = 'new';
    this.leads.push(lead);
    this.leadsSubject.next([...this.leads]);
  }

  updateLead(updatedLead: Lead): void {
    const index = this.leads.findIndex(l => l.id === updatedLead.id);
    if (index > -1) {
      updatedLead.updatedAt = new Date().toISOString();
      this.leads[index] = updatedLead;
      this.leadsSubject.next([...this.leads]);
    }
  }

  deleteLead(id: string): void {
    this.leads = this.leads.filter(l => l.id !== id);
    this.leadsSubject.next([...this.leads]);
  }

  generateLeadNumber(): string {
    // Create a copy of leads array to avoid mutating original
    const sortedLeads = [...this.leads].sort((a, b) => a.leadNumber.localeCompare(b.leadNumber));
    const lastLead = sortedLeads.length > 0 ? sortedLeads[sortedLeads.length - 1] : null;
    
    if (lastLead) {
      const lastNumber = parseInt(lastLead.leadNumber.replace('LD', ''), 10);
      return 'LD' + String(lastNumber + 1).padStart(3, '0');
    }
    return 'LD001';
  }

  // Status Management
  updateLeadStatus(leadId: string, status: Lead['status'], performedBy?: string, performedByName?: string): void {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      const oldStatus = lead.status;
      lead.status = status;
      lead.updatedAt = new Date().toISOString();
      this.leadsSubject.next([...this.leads]);

      // Add activity
      if (performedBy && performedByName) {
        this.addActivity({
          id: '',
          leadId: leadId,
          activityType: 'status-change',
          description: `Status changed from ${oldStatus} to ${status}`,
          performedBy: performedBy,
          performedByName: performedByName,
          activityDate: new Date().toISOString()
        });
      }
    }
  }

  convertLeadToSponsor(leadId: string, sponsorId: string): void {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      lead.isConverted = true;
      lead.convertedToSponsorId = sponsorId;
      lead.convertedDate = new Date().toISOString();
      lead.status = 'converted';
      lead.updatedAt = new Date().toISOString();
      this.leadsSubject.next([...this.leads]);
    }
  }

  // Assignment
  assignLeadToEmployee(leadId: string, employeeId: string, employeeName: string): void {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      lead.assignedTo = employeeId;
      lead.assignedToName = employeeName;
      lead.updatedAt = new Date().toISOString();
      this.leadsSubject.next([...this.leads]);
    }
  }

  // Activity Management
  getActivitiesByLead(leadId: string): LeadActivity[] {
    return this.activities.filter(a => a.leadId === leadId);
  }

  addActivity(activity: LeadActivity): void {
    activity.id = (this.activities.length + 1).toString();
    this.activities.push(activity);
    this.activitiesSubject.next([...this.activities]);
  }

  // Statistics
  getStats() {
    return {
      totalLeads: this.leads.length,
      newLeads: this.leads.filter(l => l.status === 'new').length,
      contacted: this.leads.filter(l => l.status === 'contacted').length,
      interested: this.leads.filter(l => l.status === 'interested').length,
      negotiation: this.leads.filter(l => l.status === 'negotiation').length,
      converted: this.leads.filter(l => l.status === 'converted').length,
      lost: this.leads.filter(l => l.status === 'lost').length,
      conversionRate: this.leads.length > 0 
        ? ((this.leads.filter(l => l.status === 'converted').length / this.leads.length) * 100).toFixed(1) + '%'
        : '0%',
      highUrgency: this.leads.filter(l => l.urgencyLevel === 'high' && !l.isConverted).length
    };
  }

  // Filters
  getLeadsByStatus(status: Lead['status']): Lead[] {
    return this.leads.filter(l => l.status === status);
  }

  getLeadsByEmployee(employeeId: string): Lead[] {
    return this.leads.filter(l => l.assignedTo === employeeId);
  }

  getLeadsByUrgency(urgency: Lead['urgencyLevel']): Lead[] {
    return this.leads.filter(l => l.urgencyLevel === urgency && !l.isConverted);
  }

  getActiveLeads(): Lead[] {
    return this.leads.filter(l => !l.isConverted && l.status !== 'lost');
  }
}

