import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Lead, LeadActivity } from '../../../models/lead.model';
import { LeadService } from '../../../services/lead.service';
import { SponsorService } from '../../../services/sponsor.service';
import { Sponsor } from '../../../models/sponsor.model';

@Component({
  selector: 'app-lead-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './lead-details.component.html',
  styleUrl: './lead-details.component.css'
})
export class LeadDetailsComponent implements OnInit {
  lead: Lead | null = null;
  activities: LeadActivity[] = [];
  leadId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private sponsorService: SponsorService
  ) {}

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id') || '';
    this.loadLead();
    this.loadActivities();
  }

  loadLead(): void {
    this.lead = this.leadService.getLeadById(this.leadId) || null;
    if (!this.lead) {
      this.router.navigate(['/leads']);
    }
  }

  loadActivities(): void {
    this.activities = this.leadService.getActivitiesByLead(this.leadId);
    // Sort by date, newest first
    this.activities.sort((a, b) => 
      new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    );
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }

  editLead(): void {
    this.router.navigate(['/leads'], { queryParams: { edit: this.leadId } });
  }

  convertToSponsor(): void {
    if (!this.lead) return;
    
    if (this.lead.isConverted) {
      alert('This lead has already been converted to a sponsor!');
      return;
    }

    // Create new sponsor from lead data
    const newSponsor: Sponsor = {
      id: '',
      sponsorCode: this.sponsorService.generateSponsorCode(),
      fullName: this.lead.fullName,
      emiratesId: '', // This needs to be filled later
      nationality: 'UAE', // Default, can be changed later
      phone: this.lead.phone,
      alternatePhone: this.lead.alternatePhone,
      email: this.lead.email,
      emirates: this.lead.emirates,
      area: this.lead.area,
      address: this.lead.address || '',
      status: 'active',
      totalHired: 0,
      currentWorkers: 0,
      createdAt: '',
      updatedAt: ''
    };

    // Add sponsor to the list
    this.sponsorService.addSponsor(newSponsor);
    
    // Get the newly created sponsor
    this.sponsorService.getSponsors().subscribe(sponsors => {
      const convertedSponsor = sponsors[sponsors.length - 1];
      
      // Mark lead as converted
      this.leadService.convertLeadToSponsor(this.lead!.id, convertedSponsor.id);
      
      // Show success message
      alert(`✅ Lead successfully converted to Sponsor!\nSponsor Code: ${convertedSponsor.sponsorCode}\n\nRedirecting to sponsor details...`);
      
      // Navigate to the sponsor details page
      this.router.navigate(['/sponsors', convertedSponsor.id]);
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'interested': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'converted': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getUrgencyClass(urgency: string): string {
    const classes: any = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return classes[urgency] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatShortDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  getActivityIcon(type: string): string {
    const icons: any = {
      'call': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      'meeting': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      'email': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'note': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      'status-change': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    };
    return icons[type] || icons['note'];
  }

  getActivityColor(type: string): string {
    const colors: any = {
      'call': 'text-blue-600',
      'meeting': 'text-purple-600',
      'email': 'text-green-600',
      'note': 'text-gray-600',
      'status-change': 'text-orange-600'
    };
    return colors[type] || 'text-gray-600';
  }
}

