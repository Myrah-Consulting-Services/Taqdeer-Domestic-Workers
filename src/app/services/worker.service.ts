import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Worker, WorkerFormData, NationalityPricing } from '../models/worker.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private workers: Worker[] = [
    // Sample workers for different agents
    {
      id: '1',
      workerCode: 'W001',
      fullName: 'Fatima Hassan',
      dateOfBirth: new Date('1992-05-15'),
      age: 32,
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      religion: 'Muslim',
      passportNumber: 'ET1234567',
      passportIssueDate: new Date('2020-01-15'),
      passportExpiryDate: new Date('2030-01-15'),
      visaType: 'visit',
      visaNumber: 'V123456',
      visaIssueDate: new Date('2024-01-10'),
      visaExpiryDate: new Date('2024-04-10'),
      arrivalDate: new Date('2024-01-12'),
      workerType: 'housemaid',
      workDescription: '• House cleaning and maintenance\n• Cooking and meal preparation\n• Laundry and ironing\n• Childcare and supervision\n• Grocery shopping\n• Pet care (if needed)\n• Basic gardening\n• Elderly care assistance',
      experience: 5,
      languages: ['Amharic', 'Arabic', 'English'],
      skills: ['Cooking', 'Cleaning', 'Childcare'],
      agentId: '1',
      agentCode: 'AG001',
      agentName: 'Global Recruitment Services',
      agentCommission: 500,
      sponsorId: '1',
      sponsorName: 'Ahmed Mohammed Al Maktoum',
      sponsorPhone: '+971501234567',
      sponsorEmirates: 'Dubai',
      currentStatus: 'placed',
      availableFrom: new Date('2024-01-12'),
      placementDate: new Date('2024-01-20'),
      contractStartDate: new Date('2024-01-20'),
      contractEndDate: new Date('2026-01-20'),
      packageAmount: 5000,
      advanceReceived: 5000,
      remainingAmount: 0,
      paymentStatus: 'paid',
      invoiceNumber: 'INV-2024-001',
      medicalStatus: 'passed',
      medicalDate: new Date('2024-01-13'),
      createdBy: 'agent001',
      createdDate: new Date('2024-01-12'),
      lastUpdated: new Date('2024-01-12')
    },
    {
      id: '2',
      workerCode: 'W002',
      fullName: 'Maria Santos',
      dateOfBirth: new Date('1988-08-20'),
      age: 36,
      nationality: 'Philippines',
      gender: 'female',
      maritalStatus: 'married',
      religion: 'Christian',
      passportNumber: 'PH9876543',
      passportIssueDate: new Date('2019-06-10'),
      passportExpiryDate: new Date('2029-06-10'),
      visaType: 'work',
      visaNumber: 'W987654',
      visaIssueDate: new Date('2024-01-05'),
      visaExpiryDate: new Date('2026-01-05'),
      arrivalDate: new Date('2024-01-08'),
      workerType: 'cook',
      workDescription: '• Meal planning and preparation\n• Cooking various cuisines\n• Baking and desserts\n• Kitchen organization\n• Grocery shopping for ingredients\n• Special diet cooking\n• Food storage and preservation\n• Kitchen cleaning and maintenance',
      experience: 8,
      languages: ['Tagalog', 'English', 'Arabic'],
      skills: ['Cooking', 'Baking', 'Meal Planning'],
      agentId: '2',
      agentCode: 'AG002',
      agentName: 'Asia Pacific Manpower',
      agentCommission: 960, // 8% of 12000
      currentStatus: 'placed',
      availableFrom: new Date('2024-01-08'),
      interviewDate: new Date('2024-01-10'),
      trialStartDate: new Date('2024-01-12'),
      trialEndDate: new Date('2024-01-19'),
      placementDate: new Date('2024-01-20'),
      contractStartDate: new Date('2024-01-20'),
      contractEndDate: new Date('2026-01-20'),
      sponsorId: 'S001',
      sponsorName: 'Ahmed Al Maktoum',
      sponsorPhone: '+971501111111',
      sponsorEmirates: 'Dubai',
      packageAmount: 12000,
      advanceReceived: 6000,
      remainingAmount: 0,
      paymentStatus: 'paid',
      invoiceNumber: 'INV-2024-001',
      medicalStatus: 'passed',
      medicalDate: new Date('2024-01-09'),
      createdBy: 'agent002',
      createdDate: new Date('2024-01-08'),
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: '3',
      workerCode: 'W003',
      fullName: 'Lakshmi Perera',
      dateOfBirth: new Date('1990-11-12'),
      age: 34,
      nationality: 'Sri Lanka',
      gender: 'female',
      maritalStatus: 'married',
      religion: 'Buddhist',
      passportNumber: 'LK7654321',
      passportIssueDate: new Date('2020-05-20'),
      passportExpiryDate: new Date('2030-05-20'),
      visaType: 'visit',
      visaNumber: 'V777888',
      visaIssueDate: new Date('2024-01-20'),
      visaExpiryDate: new Date('2024-04-20'),
      arrivalDate: new Date('2024-01-22'),
      workerType: 'housemaid',
      experience: 6,
      languages: ['Sinhala', 'English', 'Arabic'],
      skills: ['Cleaning', 'Cooking', 'Elderly Care'],
      agentId: '3',
      agentCode: 'AG003',
      agentName: 'East Africa Recruitment',
      agentCommission: 450,
      currentStatus: 'trial',
      availableFrom: new Date('2024-01-22'),
      interviewDate: new Date('2024-01-25'),
      trialStartDate: new Date('2024-01-28'),
      trialEndDate: new Date('2024-02-04'),
      sponsorId: 'S002',
      sponsorName: 'Fatima Al Nahyan',
      sponsorPhone: '+971502222222',
      sponsorEmirates: 'Abu Dhabi',
      packageAmount: 15000,
      advanceReceived: 7500,
      remainingAmount: 7500,
      paymentStatus: 'partial',
      medicalStatus: 'passed',
      medicalDate: new Date('2024-01-23'),
      createdBy: 'agent003',
      createdDate: new Date('2024-01-22'),
      lastUpdated: new Date('2024-01-28')
    },
    // NEW AVAILABLE WORKER 1
    {
      id: '4',
      workerCode: 'W004',
      fullName: 'Priya Sharma',
      dateOfBirth: new Date('1995-03-10'),
      age: 29,
      nationality: 'India',
      gender: 'female',
      maritalStatus: 'single',
      religion: 'Hindu',
      passportNumber: 'IN5566778',
      passportIssueDate: new Date('2021-02-15'),
      passportExpiryDate: new Date('2031-02-15'),
      visaType: 'visit',
      visaNumber: 'V556677',
      visaIssueDate: new Date('2024-02-01'),
      visaExpiryDate: new Date('2024-05-01'),
      arrivalDate: new Date('2024-02-03'),
      workerType: 'babysitter',
      workDescription: '• Child supervision and care\n• Feeding and meal assistance\n• Bathing and hygiene help\n• Homework assistance\n• Playtime and activities\n• Bedtime routines\n• First aid and emergency care\n• School pick-up and drop-off',
      experience: 4,
      languages: ['Hindi', 'English', 'Urdu'],
      skills: ['Childcare', 'Baby Care', 'First Aid'],
      agentId: '2',
      agentCode: 'AG002',
      agentName: 'Asia Pacific Manpower',
      agentCommission: 600,
      currentStatus: 'available',
      availableFrom: new Date('2024-02-03'),
      packageAmount: 12000,
      advanceReceived: 0,
      remainingAmount: 12000,
      paymentStatus: 'pending',
      medicalStatus: 'passed',
      medicalDate: new Date('2024-02-04'),
      createdBy: 'agent002',
      createdDate: new Date('2024-02-03'),
      lastUpdated: new Date('2024-02-03')
    },
    // NEW AVAILABLE WORKER 2
    {
      id: '5',
      workerCode: 'W005',
      fullName: 'Aisha Mohammed',
      dateOfBirth: new Date('1990-07-25'),
      age: 34,
      nationality: 'Kenya',
      gender: 'female',
      maritalStatus: 'married',
      religion: 'Muslim',
      passportNumber: 'KE9988776',
      passportIssueDate: new Date('2020-08-10'),
      passportExpiryDate: new Date('2030-08-10'),
      visaType: 'visit',
      visaNumber: 'V998877',
      visaIssueDate: new Date('2024-02-05'),
      visaExpiryDate: new Date('2024-05-05'),
      arrivalDate: new Date('2024-02-07'),
      workerType: 'cook',
      experience: 7,
      languages: ['Swahili', 'English', 'Arabic'],
      skills: ['Cooking', 'Baking', 'Kitchen Management'],
      agentId: '3',
      agentCode: 'AG003',
      agentName: 'East Africa Recruitment',
      agentCommission: 400,
      currentStatus: 'available',
      availableFrom: new Date('2024-02-07'),
      packageAmount: 8000,
      advanceReceived: 0,
      remainingAmount: 8000,
      paymentStatus: 'pending',
      medicalStatus: 'passed',
      medicalDate: new Date('2024-02-08'),
      createdBy: 'agent003',
      createdDate: new Date('2024-02-07'),
      lastUpdated: new Date('2024-02-07')
    }
  ];

  private workersSubject = new BehaviorSubject<Worker[]>(this.workers);
  public workers$ = this.workersSubject.asObservable();

  constructor(private authService: AuthService) {}

  // Get workers based on user role
  getWorkers(): Observable<Worker[]> {
    return this.workers$.pipe(
      map(workers => {
        const currentUser = this.authService.currentUser;
        
        // If admin, return all workers
        if (currentUser?.role === 'admin') {
          return workers;
        }
        
        // If agent, return only their workers
        if (currentUser?.role === 'agent' && currentUser.agentId) {
          return workers.filter(w => w.agentId === currentUser.agentId);
        }
        
        // If employee (receptionist, accountant, etc.), return all workers
        if (currentUser?.role === 'employee') {
          return workers;
        }
        
        return [];
      })
    );
  }

  getAllWorkers(): Worker[] {
    return this.workers;
  }

  getWorkerById(id: string): Worker | undefined {
    return this.workers.find(w => w.id === id);
  }

  getWorkersByAgent(agentId: string): Worker[] {
    return this.workers.filter(w => w.agentId === agentId);
  }

  getWorkersByStatus(status: string): Worker[] {
    if (status === 'all') return this.workers;
    return this.workers.filter(w => w.currentStatus === status);
  }

  addWorker(workerData: WorkerFormData): Worker {
    const currentUser = this.authService.currentUser;
    
    // Calculate age
    const age = this.calculateAge(workerData.dateOfBirth);
    
    // Get pricing based on nationality
    const packageAmount = NationalityPricing[workerData.nationality];
    
    // Get agent details
    const agent = this.getAgentDetails(workerData.agentId);
    
    const newWorker: Worker = {
      id: this.generateId(),
      workerCode: this.generateWorkerCode(),
      ...workerData,
      age,
      agentCode: agent.code,
      agentName: agent.name,
      agentCommission: agent.commission,
      currentStatus: 'available',
      availableFrom: workerData.arrivalDate || new Date(),
      packageAmount,
      advanceReceived: 0,
      remainingAmount: packageAmount,
      paymentStatus: 'pending',
      createdBy: currentUser?.username || 'system',
      createdDate: new Date(),
      lastUpdated: new Date()
    };
    
    this.workers.push(newWorker);
    this.workersSubject.next([...this.workers]);
    return newWorker;
  }

  updateWorker(id: string, workerData: Partial<Worker>): boolean {
    const index = this.workers.findIndex(w => w.id === id);
    if (index !== -1) {
      // Recalculate age if dateOfBirth is updated
      if (workerData.dateOfBirth) {
        workerData.age = this.calculateAge(workerData.dateOfBirth);
      }
      
      this.workers[index] = { 
        ...this.workers[index], 
        ...workerData,
        lastUpdated: new Date()
      };
      this.workersSubject.next([...this.workers]);
      return true;
    }
    return false;
  }

  updateWorkerStatus(id: string, status: Worker['currentStatus'], additionalData?: Partial<Worker>): boolean {
    const index = this.workers.findIndex(w => w.id === id);
    if (index !== -1) {
      this.workers[index] = {
        ...this.workers[index],
        currentStatus: status,
        ...additionalData,
        lastUpdated: new Date()
      };
      this.workersSubject.next([...this.workers]);
      return true;
    }
    return false;
  }

  deleteWorker(id: string): boolean {
    const index = this.workers.findIndex(w => w.id === id);
    if (index !== -1) {
      this.workers.splice(index, 1);
      this.workersSubject.next([...this.workers]);
      return true;
    }
    return false;
  }

  getWorkerStats() {
    const currentUser = this.authService.currentUser;
    let filteredWorkers = this.workers;
    
    // Filter by agent if not admin
    if (currentUser?.role === 'agent' && currentUser.agentId) {
      filteredWorkers = this.workers.filter(w => w.agentId === currentUser.agentId);
    }
    
    return {
      total: filteredWorkers.length,
      available: filteredWorkers.filter(w => w.currentStatus === 'available').length,
      interview: filteredWorkers.filter(w => w.currentStatus === 'interview').length,
      trial: filteredWorkers.filter(w => w.currentStatus === 'trial').length,
      placed: filteredWorkers.filter(w => w.currentStatus === 'placed').length,
      returned: filteredWorkers.filter(w => w.currentStatus === 'returned').length,
      absconded: filteredWorkers.filter(w => w.currentStatus === 'absconded').length
    };
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateWorkerCode(): string {
    const maxCode = this.workers.reduce((max, worker) => {
      const numPart = parseInt(worker.workerCode.replace('W', ''));
      return numPart > max ? numPart : max;
    }, 0);
    return `W${String(maxCode + 1).padStart(3, '0')}`;
  }

  private getAgentDetails(agentId: string): {code: string, name: string, commission: number} {
    // This should ideally come from AgentService
    const agentMap: Record<string, {code: string, name: string, commission: number}> = {
      '1': { code: 'AG001', name: 'Global Recruitment Services', commission: 500 },
      '2': { code: 'AG002', name: 'Asia Pacific Manpower', commission: 960 },
      '3': { code: 'AG003', name: 'East Africa Recruitment', commission: 450 },
      '4': { code: 'AG004', name: 'Lanka Manpower Services', commission: 1500 },
      '5': { code: 'AG005', name: 'Nepal Overseas Employment', commission: 600 }
    };
    
    return agentMap[agentId] || { code: 'AG000', name: 'Unknown Agent', commission: 0 };
  }
}
