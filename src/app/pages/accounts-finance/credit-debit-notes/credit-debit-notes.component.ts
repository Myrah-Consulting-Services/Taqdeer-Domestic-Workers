import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsFinanceService } from '../../../services/accounts-finance.service';
import { CreditDebitNote, RefundReason, REFUND_REASONS } from '../../../models/accounts-finance.model';
import { SponsorService } from '../../../services/sponsor.service';
import { Sponsor } from '../../../models/sponsor.model';

@Component({
  selector: 'app-credit-debit-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-debit-notes.component.html',
  styleUrl: './credit-debit-notes.component.css'
})
export class CreditDebitNotesComponent implements OnInit {
  notes: CreditDebitNote[] = [];
  filteredNotes: CreditDebitNote[] = [];
  searchTerm: string = '';
  typeFilter: string = 'all';
  statusFilter: string = 'all';
  showAddModal: boolean = false;
  showViewModal: boolean = false;
  selectedNote: CreditDebitNote | null = null;
  sponsors: Sponsor[] = [];
  
  // Form data for new note
  newNote = {
    type: 'credit' as 'credit' | 'debit',
    relatedSaleId: '',
    saleCode: '',
    sponsorName: '',
    workerName: '',
    reason: '' as RefundReason,
    originalAmount: 0,
    refundAmount: 0,
    notes: ''
  };

  refundReasons = REFUND_REASONS;

  constructor(
    private accountsFinanceService: AccountsFinanceService,
    private sponsorService: SponsorService
  ) {}

  ngOnInit(): void {
    this.loadNotes();
    this.loadSponsors();
  }

  loadNotes(): void {
    this.notes = this.accountsFinanceService.getCreditDebitNotes();
    this.applyFilters();
  }

  loadSponsors(): void {
    this.sponsorService.getSponsors().subscribe(sponsors => {
      this.sponsors = sponsors;
    });
  }

  applyFilters(): void {
    this.filteredNotes = this.notes.filter(note => {
      const matchesSearch = note.sponsorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           note.workerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           note.saleCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           note.noteNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.typeFilter === 'all' || note.type === this.typeFilter;
      const matchesStatus = this.statusFilter === 'all' || note.status === this.statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTypeFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  openViewModal(note: CreditDebitNote): void {
    this.selectedNote = note;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedNote = null;
  }

  resetForm(): void {
    this.newNote = {
      type: 'credit',
      relatedSaleId: '',
      saleCode: '',
      sponsorName: '',
      workerName: '',
      reason: 'other' as RefundReason,
      originalAmount: 0,
      refundAmount: 0,
      notes: ''
    };
  }

  onSponsorChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedSponsorId = target.value;
    const selectedSponsor = this.sponsors.find(s => s.id === selectedSponsorId);
    if (selectedSponsor) {
      this.newNote.sponsorName = selectedSponsor.fullName;
    }
  }

  addNote(): void {
    if (this.newNote.saleCode && this.newNote.sponsorName && this.newNote.workerName && this.newNote.refundAmount > 0) {
      const note = this.accountsFinanceService.createCreditDebitNote({
        ...this.newNote,
        relatedSaleId: this.newNote.relatedSaleId || 'SAL-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'draft'
      });
      
      this.notes.unshift(note);
      this.applyFilters();
      this.closeAddModal();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeClass(type: string): string {
    return type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }


  calculateRefundAmount(): void {
    if (this.newNote.originalAmount > 0 && this.newNote.reason) {
      // Simple calculation - in real app, this would use the service method
      if (this.newNote.reason === 'worker-returned-trial' || 
          this.newNote.reason === 'worker-absconded' || 
          this.newNote.reason === 'worker-illness' || 
          this.newNote.reason === 'worker-pregnancy') {
        this.newNote.refundAmount = this.newNote.originalAmount; // Full refund
      } else {
        this.newNote.refundAmount = this.newNote.originalAmount * 0.8; // 80% refund as example
      }
    }
  }

  issueNote(): void {
    if (this.selectedNote && this.selectedNote.status === 'draft') {
      // Update the note status to 'issued'
      this.selectedNote.status = 'issued';
      this.selectedNote.processedDate = new Date().toISOString().split('T')[0];
      
      // Update the note in the service
      this.accountsFinanceService.updateCreditDebitNote(this.selectedNote);
      
      // Refresh the list
      this.loadNotes();
      
      // Close the modal
      this.closeViewModal();
    }
  }
}