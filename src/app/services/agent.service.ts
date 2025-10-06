import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agent, AgentFormData } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private agents: Agent[] = [
    {
      id: '1',
      agentCode: 'AG001',
      agentName: 'Global Recruitment Services',
      companyName: 'Global Recruitment Services LLC',
      contactPerson: 'Ahmed Hassan',
      email: 'ahmed@globalrecruitment.com',
      phone: '+971501234567',
      alternatePhone: '+971501234568',
      country: 'UAE',
      city: 'Dubai',
      address: 'Business Bay, Dubai, UAE',
      commissionType: 'fixed',
      commissionValue: 500,
      bankName: 'Emirates NBD',
      accountNumber: '1234567890',
      iban: 'AE070331234567890123456',
      swiftCode: 'EBILAEAD',
      status: 'active',
      registrationDate: new Date('2023-01-15'),
      totalWorkersSupplied: 45,
      totalCommissionPaid: 22500,
      notes: 'Reliable agent, specializes in Ethiopian workers'
    },
    {
      id: '2',
      agentCode: 'AG002',
      agentName: 'Asia Pacific Manpower',
      companyName: 'Asia Pacific Manpower Solutions',
      contactPerson: 'Priya Sharma',
      email: 'priya@asiapacific.com',
      phone: '+971509876543',
      alternatePhone: '+971509876544',
      country: 'UAE',
      city: 'Abu Dhabi',
      address: 'Mussafah, Abu Dhabi, UAE',
      commissionType: 'percentage',
      commissionValue: 8,
      bankName: 'Abu Dhabi Commercial Bank',
      accountNumber: '9876543210',
      iban: 'AE070331234567890987654',
      swiftCode: 'ADCBAEAA',
      status: 'active',
      registrationDate: new Date('2023-03-20'),
      totalWorkersSupplied: 32,
      totalCommissionPaid: 30720,
      notes: 'Specializes in Filipino and Indian domestic workers'
    },
    {
      id: '3',
      agentCode: 'AG003',
      agentName: 'East Africa Recruitment',
      companyName: 'East Africa Recruitment Agency',
      contactPerson: 'Mohammed Ali',
      email: 'mohammed@eastafrica.com',
      phone: '+971505555555',
      country: 'UAE',
      city: 'Sharjah',
      address: 'Al Nahda, Sharjah, UAE',
      commissionType: 'fixed',
      commissionValue: 450,
      bankName: 'Mashreq Bank',
      accountNumber: '5555666677',
      iban: 'AE070335555666677889900',
      status: 'active',
      registrationDate: new Date('2023-06-10'),
      totalWorkersSupplied: 28,
      totalCommissionPaid: 12600,
      notes: 'Ethiopian and Kenyan workers'
    },
    {
      id: '4',
      agentCode: 'AG004',
      agentName: 'Lanka Manpower Services',
      contactPerson: 'Sunil Fernando',
      email: 'sunil@lankamanpower.com',
      phone: '+971507777888',
      alternatePhone: '+971507777889',
      country: 'Sri Lanka',
      city: 'Colombo',
      address: 'Colombo 03, Sri Lanka',
      commissionType: 'percentage',
      commissionValue: 10,
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '7778889990',
      status: 'active',
      registrationDate: new Date('2023-08-05'),
      totalWorkersSupplied: 18,
      totalCommissionPaid: 27000,
      notes: 'Sri Lankan workers only'
    },
    {
      id: '5',
      agentCode: 'AG005',
      agentName: 'Nepal Overseas Employment',
      companyName: 'Nepal Overseas Employment Pvt. Ltd.',
      contactPerson: 'Rajesh Thapa',
      email: 'rajesh@nepaloverseas.com',
      phone: '+977981234567',
      country: 'Nepal',
      city: 'Kathmandu',
      address: 'Thamel, Kathmandu, Nepal',
      commissionType: 'fixed',
      commissionValue: 600,
      status: 'inactive',
      registrationDate: new Date('2022-11-20'),
      totalWorkersSupplied: 12,
      totalCommissionPaid: 7200,
      notes: 'Currently inactive - pending license renewal'
    }
  ];

  private agentsSubject = new BehaviorSubject<Agent[]>(this.agents);
  public agents$ = this.agentsSubject.asObservable();

  constructor() { }

  getAllAgents(): Observable<Agent[]> {
    return this.agents$;
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  getActiveAgents(): Agent[] {
    return this.agents.filter(agent => agent.status === 'active');
  }

  addAgent(agentData: AgentFormData): Agent {
    const newAgent: Agent = {
      id: this.generateId(),
      ...agentData,
      registrationDate: new Date(),
      totalWorkersSupplied: 0,
      totalCommissionPaid: 0
    };
    
    this.agents.push(newAgent);
    this.agentsSubject.next([...this.agents]);
    return newAgent;
  }

  updateAgent(id: string, agentData: Partial<AgentFormData>): boolean {
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index !== -1) {
      this.agents[index] = { ...this.agents[index], ...agentData };
      this.agentsSubject.next([...this.agents]);
      return true;
    }
    return false;
  }

  deleteAgent(id: string): boolean {
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index !== -1) {
      this.agents.splice(index, 1);
      this.agentsSubject.next([...this.agents]);
      return true;
    }
    return false;
  }

  updateAgentStatus(id: string, status: 'active' | 'inactive'): boolean {
    const agent = this.agents.find(agent => agent.id === id);
    if (agent) {
      agent.status = status;
      this.agentsSubject.next([...this.agents]);
      return true;
    }
    return false;
  }

  getAgentStats() {
    return {
      totalAgents: this.agents.length,
      activeAgents: this.agents.filter(a => a.status === 'active').length,
      inactiveAgents: this.agents.filter(a => a.status === 'inactive').length,
      totalWorkersSupplied: this.agents.reduce((sum, a) => sum + a.totalWorkersSupplied, 0),
      totalCommissionPaid: this.agents.reduce((sum, a) => sum + a.totalCommissionPaid, 0)
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateAgentCode(): string {
    const maxCode = this.agents.reduce((max, agent) => {
      const numPart = parseInt(agent.agentCode.replace('AG', ''));
      return numPart > max ? numPart : max;
    }, 0);
    return `AG${String(maxCode + 1).padStart(3, '0')}`;
  }
}


