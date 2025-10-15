import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sponsor, WorkerAssignment, PaymentHistory, WorkerInterview, WORKER_PRICING } from '../models/sponsor.model';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {
  private sponsors: Sponsor[] = [
    {
      id: '1',
      sponsorCode: 'SP001',
      fullName: 'Ahmed Mohammed Al Maktoum',
      emiratesId: '784-1990-1234567-1',
      nationality: 'UAE',
      phone: '+971501234567',
      alternatePhone: '+97142345678',
      email: 'ahmed.almaktoum@email.ae',
      emirates: 'Dubai',
      area: 'Jumeirah',
      address: 'Villa 45, Jumeirah 1',
      status: 'active',
      totalHired: 3,
      currentWorkers: 2,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      sponsorCode: 'SP002',
      fullName: 'Fatima Hassan Al Nahyan',
      emiratesId: '784-1985-7654321-2',
      nationality: 'UAE',
      phone: '+971509876543',
      email: 'fatima.hassan@email.ae',
      emirates: 'Abu Dhabi',
      area: 'Khalifa City',
      address: 'Villa 12, Sector A',
      status: 'active',
      totalHired: 1,
      currentWorkers: 1,
      createdAt: '2024-02-10T11:30:00Z',
      updatedAt: '2024-02-10T11:30:00Z'
    },
    {
      id: '3',
      sponsorCode: 'SP003',
      fullName: 'Mohammed Rashid Al Qasimi',
      emiratesId: '784-1988-9876543-3',
      nationality: 'UAE',
      phone: '+971561122334',
      alternatePhone: '+97165544332',
      email: 'mohammed.rashid@email.ae',
      emirates: 'Sharjah',
      area: 'Al Majaz',
      address: 'Apartment 305, Al Majaz Towers',
      status: 'active',
      totalHired: 2,
      currentWorkers: 1,
      createdAt: '2024-03-05T09:00:00Z',
      updatedAt: '2024-03-05T09:00:00Z'
    }
  ];

  private assignments: WorkerAssignment[] = [
    {
      id: '1',
      workerId: '1',
      workerName: 'Fatima Hassan',
      workerPassport: 'ET1234567',
      workerNationality: 'Ethiopia',
      workerType: 'Housemaid',
      sponsorId: '1',
      sponsorName: 'Ahmed Mohammed Al Maktoum',
      totalAmount: 5000,
      advanceAmount: 2000,
      remainingAmount: 3000,
      paidAmount: 5000,
      contractStartDate: '2024-01-20T00:00:00Z',
      contractEndDate: '2026-01-20T00:00:00Z',
      contractStatus: 'confirmed',
      trialStartDate: '2024-01-20T00:00:00Z',
      trialEndDate: '2024-01-27T00:00:00Z',
      isOnTrial: false,
      assignmentStatus: 'active',
      invoiceNumber: 'INV-2024-001',
      invoiceDate: '2024-01-25T00:00:00Z',
      quotationNumber: 'QT-2024-001',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z'
    },
    {
      id: '2',
      workerId: '3',
      workerName: 'Lakshmi Perera',
      workerPassport: 'LK7654321',
      workerNationality: 'Sri Lanka',
      workerType: 'Cook',
      sponsorId: '2',
      sponsorName: 'Fatima Hassan Al Nahyan',
      totalAmount: 15000,
      advanceAmount: 5000,
      remainingAmount: 10000,
      paidAmount: 5000,
      contractStartDate: '2024-02-15T00:00:00Z',
      contractEndDate: '2026-02-15T00:00:00Z',
      contractStatus: 'trial',
      trialStartDate: '2024-02-15T00:00:00Z',
      trialEndDate: '2024-02-22T00:00:00Z',
      isOnTrial: true,
      assignmentStatus: 'on-trial',
      quotationNumber: 'QT-2024-002',
      createdAt: '2024-02-15T11:00:00Z',
      updatedAt: '2024-02-15T11:00:00Z'
    }
  ];

  private paymentHistory: PaymentHistory[] = [];

  private interviews: WorkerInterview[] = [
    {
      id: '1',
      sponsorId: '1',
      sponsorName: 'Ahmed Mohammed Al Maktoum',
      workerId: '2',
      workerName: 'Priya Sharma',
      workerPassport: 'IN9876543',
      workerNationality: 'India',
      workerType: 'Nanny',
      interviewDate: '2024-03-15',
      interviewTime: '10:00',
      interviewLocation: 'Villa 45, Jumeirah 1, Dubai',
      interviewStatus: 'completed',
      result: 'selected',
      interviewNotes: 'Excellent communication skills, experienced with children',
      sponsorFeedback: 'Very impressed, want to hire',
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-03-15T11:00:00Z'
    },
    {
      id: '2',
      sponsorId: '1',
      sponsorName: 'Ahmed Mohammed Al Maktoum',
      workerId: '4',
      workerName: 'Maria Santos',
      workerPassport: 'PH1234567',
      workerNationality: 'Philippines',
      workerType: 'Driver',
      interviewDate: '2024-03-12',
      interviewTime: '14:00',
      interviewLocation: 'Villa 45, Jumeirah 1, Dubai',
      interviewStatus: 'completed',
      result: 'rejected',
      rejectionReason: 'Limited driving experience in UAE',
      interviewNotes: 'Good personality but needs more training',
      createdAt: '2024-03-08T10:00:00Z',
      updatedAt: '2024-03-12T15:00:00Z'
    },
    {
      id: '3',
      sponsorId: '2',
      sponsorName: 'Fatima Hassan Al Nahyan',
      workerId: '5',
      workerName: 'John Kamau',
      workerPassport: 'KE5555555',
      workerNationality: 'Kenya',
      workerType: 'Gardener',
      interviewDate: '2024-03-20',
      interviewTime: '09:00',
      interviewLocation: 'Villa 12, Sector A, Abu Dhabi',
      interviewStatus: 'scheduled',
      result: 'pending',
      interviewNotes: 'Scheduled for next week',
      createdAt: '2024-03-18T10:00:00Z',
      updatedAt: '2024-03-18T10:00:00Z'
    }
  ];

  private sponsorsSubject = new BehaviorSubject<Sponsor[]>(this.sponsors);
  private assignmentsSubject = new BehaviorSubject<WorkerAssignment[]>(this.assignments);
  private interviewsSubject = new BehaviorSubject<WorkerInterview[]>(this.interviews);

  sponsors$ = this.sponsorsSubject.asObservable();
  assignments$ = this.assignmentsSubject.asObservable();
  interviews$ = this.interviewsSubject.asObservable();

  constructor() { }

  // Sponsor CRUD
  getSponsors(): Observable<Sponsor[]> {
    return this.sponsors$;
  }

  getSponsorById(id: string): Sponsor | undefined {
    return this.sponsors.find(s => s.id === id);
  }

  addSponsor(sponsor: Sponsor): void {
    sponsor.id = (this.sponsors.length + 1).toString();
    sponsor.createdAt = new Date().toISOString();
    sponsor.updatedAt = new Date().toISOString();
    sponsor.totalHired = 0;
    sponsor.currentWorkers = 0;
    this.sponsors.push(sponsor);
    this.sponsorsSubject.next([...this.sponsors]);
  }

  updateSponsor(updatedSponsor: Sponsor): void {
    const index = this.sponsors.findIndex(s => s.id === updatedSponsor.id);
    if (index > -1) {
      updatedSponsor.updatedAt = new Date().toISOString();
      this.sponsors[index] = updatedSponsor;
      this.sponsorsSubject.next([...this.sponsors]);
    }
  }

  deleteSponsor(id: string): void {
    this.sponsors = this.sponsors.filter(s => s.id !== id);
    this.sponsorsSubject.next([...this.sponsors]);
  }

  generateSponsorCode(): string {
    // Create a copy of sponsors array to avoid mutating original
    const sortedSponsors = [...this.sponsors].sort((a, b) => a.sponsorCode.localeCompare(b.sponsorCode));
    const lastSponsor = sortedSponsors.length > 0 ? sortedSponsors[sortedSponsors.length - 1] : null;
    
    if (lastSponsor) {
      const lastNumber = parseInt(lastSponsor.sponsorCode.replace('SP', ''), 10);
      return 'SP' + String(lastNumber + 1).padStart(3, '0');
    }
    return 'SP001';
  }

  // Worker Assignment
  getAssignments(): Observable<WorkerAssignment[]> {
    return this.assignments$;
  }

  getAssignmentsBySponsors(sponsorId: string): WorkerAssignment[] {
    return this.assignments.filter(a => a.sponsorId === sponsorId);
  }

  getAssignmentsByWorker(workerId: string): WorkerAssignment[] {
    return this.assignments.filter(a => a.workerId === workerId);
  }

  assignWorkerToSponsor(assignment: WorkerAssignment): void {
    assignment.id = (this.assignments.length + 1).toString();
    assignment.createdAt = new Date().toISOString();
    assignment.updatedAt = new Date().toISOString();
    
    // Auto-calculate pricing based on nationality
    assignment.totalAmount = WORKER_PRICING[assignment.workerNationality] || 10000;
    assignment.remainingAmount = assignment.totalAmount - assignment.advanceAmount;
    
    // Set trial period (7 days default)
    if (assignment.isOnTrial) {
      assignment.trialStartDate = new Date().toISOString();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      assignment.trialEndDate = trialEnd.toISOString();
    }
    
    // Set contract end date (2 years)
    const contractEnd = new Date(assignment.contractStartDate);
    contractEnd.setFullYear(contractEnd.getFullYear() + 2);
    assignment.contractEndDate = contractEnd.toISOString();
    
    this.assignments.push(assignment);
    this.assignmentsSubject.next([...this.assignments]);
    
    // Update sponsor's worker count
    const sponsor = this.getSponsorById(assignment.sponsorId);
    if (sponsor) {
      sponsor.totalHired++;
      sponsor.currentWorkers++;
      this.updateSponsor(sponsor);
    }
  }

  confirmAssignment(assignmentId: string, finalPayment: number): void {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.paidAmount += finalPayment;
      assignment.remainingAmount -= finalPayment;
      assignment.contractStatus = 'confirmed';
      assignment.assignmentStatus = 'active';
      assignment.isOnTrial = false;
      
      // Generate invoice
      assignment.invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + 
        String(this.assignments.length).padStart(3, '0');
      assignment.invoiceDate = new Date().toISOString();
      
      assignment.updatedAt = new Date().toISOString();
      this.assignmentsSubject.next([...this.assignments]);
    }
  }

  returnWorker(assignmentId: string, returnReason: string): void {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.assignmentStatus = 'returned';
      assignment.returnDate = new Date().toISOString();
      assignment.returnReason = returnReason;
      
      // Cancel quotation if no invoice generated (only advance paid)
      if (!assignment.invoiceNumber && assignment.quotationNumber) {
        assignment.quotationNumber = assignment.quotationNumber + ' (CANCELLED)';
      }
      
      assignment.updatedAt = new Date().toISOString();
      this.assignmentsSubject.next([...this.assignments]);
      
      // Update sponsor's current workers count
      const sponsor = this.getSponsorById(assignment.sponsorId);
      if (sponsor && sponsor.currentWorkers > 0) {
        sponsor.currentWorkers--;
        this.updateSponsor(sponsor);
      }
    }
  }

  calculateRefund(assignmentId: string, refundReason: string): number {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    if (!assignment) return 0;
    
    // Full refund cases
    if (['illness', 'pregnancy', 'absconded'].includes(refundReason)) {
      return assignment.paidAmount;
    }
    
    // Proportional refund for performance issues
    const startDate = new Date(assignment.contractStartDate);
    const currentDate = new Date();
    const monthsWorked = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const monthlyRate = assignment.totalAmount / 24; // 2-year contract = 24 months
    const amountForWorkedMonths = monthlyRate * monthsWorked;
    
    return Math.max(0, assignment.paidAmount - amountForWorkedMonths);
  }

  processRefund(assignmentId: string, refundReason: string): void {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.refundAmount = this.calculateRefund(assignmentId, refundReason);
      assignment.refundReason = refundReason as any;
      assignment.refundDate = new Date().toISOString();
      assignment.assignmentStatus = 'refunded';
      assignment.updatedAt = new Date().toISOString();
      this.assignmentsSubject.next([...this.assignments]);
    }
  }

  // Interview Management
  getInterviews(): Observable<WorkerInterview[]> {
    return this.interviews$;
  }

  getInterviewsBySponsor(sponsorId: string): WorkerInterview[] {
    return this.interviews.filter(i => i.sponsorId === sponsorId);
  }

  getInterviewById(id: string): WorkerInterview | undefined {
    return this.interviews.find(i => i.id === id);
  }

  scheduleInterview(interview: WorkerInterview): void {
    interview.id = (this.interviews.length + 1).toString();
    interview.createdAt = new Date().toISOString();
    interview.updatedAt = new Date().toISOString();
    interview.interviewStatus = 'scheduled';
    interview.result = 'pending';
    this.interviews.push(interview);
    this.interviewsSubject.next([...this.interviews]);
  }

  updateInterviewResult(interviewId: string, result: 'selected' | 'rejected', feedback?: string, rejectionReason?: string): void {
    const interview = this.interviews.find(i => i.id === interviewId);
    if (interview) {
      interview.result = result;
      interview.interviewStatus = 'completed';
      interview.sponsorFeedback = feedback;
      if (result === 'rejected' && rejectionReason) {
        interview.rejectionReason = rejectionReason;
      }
      interview.updatedAt = new Date().toISOString();
      this.interviewsSubject.next([...this.interviews]);
    }
  }

  cancelInterview(interviewId: string): void {
    const interview = this.interviews.find(i => i.id === interviewId);
    if (interview) {
      interview.interviewStatus = 'cancelled';
      interview.updatedAt = new Date().toISOString();
      this.interviewsSubject.next([...this.interviews]);
    }
  }

  rescheduleInterview(interviewId: string, newDate: string, newTime: string): void {
    const interview = this.interviews.find(i => i.id === interviewId);
    if (interview) {
      interview.interviewDate = newDate;
      interview.interviewTime = newTime;
      interview.interviewStatus = 'rescheduled';
      interview.updatedAt = new Date().toISOString();
      this.interviewsSubject.next([...this.interviews]);
    }
  }

  // Statistics
  getStats() {
    return {
      totalSponsors: this.sponsors.length,
      activeSponsors: this.sponsors.filter(s => s.status === 'active').length,
      totalAssignments: this.assignments.length,
      activeAssignments: this.assignments.filter(a => a.assignmentStatus === 'active').length,
      onTrial: this.assignments.filter(a => a.isOnTrial).length,
      returned: this.assignments.filter(a => a.assignmentStatus === 'returned').length,
      refunded: this.assignments.filter(a => a.assignmentStatus === 'refunded').length,
      totalInterviews: this.interviews.length,
      scheduledInterviews: this.interviews.filter(i => i.interviewStatus === 'scheduled').length,
      completedInterviews: this.interviews.filter(i => i.interviewStatus === 'completed').length,
      selectedWorkers: this.interviews.filter(i => i.result === 'selected').length,
      rejectedWorkers: this.interviews.filter(i => i.result === 'rejected').length
    };
  }
}
