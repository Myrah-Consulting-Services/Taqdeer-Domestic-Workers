import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SalesService } from '../../../services/sales.service';
import { Sale } from '../../../models/sales.model';

@Component({
  selector: 'app-sales-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sales-details.component.html',
  styleUrl: './sales-details.component.css'
})
export class SalesDetailsComponent implements OnInit {
  sale: Sale | undefined;
  activeTab: string = 'overview';

  constructor(
    private salesService: SalesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadSale(params['id']);
      }
    });
  }

  loadSale(id: string): void {
    this.sale = this.salesService.getSaleById(id);
    if (!this.sale) {
      this.router.navigate(['/sales/list']);
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateBack(): void {
    this.router.navigate(['/sales']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'quotation': 'bg-yellow-100 text-yellow-800',
      'trial': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'refunded': 'bg-red-100 text-red-800',
      'replaced': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'bg-gray-100 text-gray-800',
      'advance-paid': 'bg-yellow-100 text-yellow-800',
      'fully-paid': 'bg-green-100 text-green-800',
      'refunded': 'bg-red-100 text-red-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  calculateTrialProgress(): number {
    if (!this.sale || !this.sale.trialStartDate || !this.sale.trialEndDate) {
      return 0;
    }

    const start = new Date(this.sale.trialStartDate).getTime();
    const end = new Date(this.sale.trialEndDate).getTime();
    const now = Date.now();

    const total = end - start;
    const elapsed = now - start;

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  calculateContractProgress(): number {
    if (!this.sale || !this.sale.contractStartDate || !this.sale.contractEndDate) {
      return 0;
    }

    const start = new Date(this.sale.contractStartDate).getTime();
    const end = new Date(this.sale.contractEndDate).getTime();
    const now = Date.now();

    const total = end - start;
    const elapsed = now - start;

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  getPaymentProgress(): number {
    if (!this.sale) return 0;
    return (this.sale.paidAmount / this.sale.totalAmount) * 100;
  }

  getRemainingAmount(): number {
    if (!this.sale) return 0;
    return this.sale.totalAmount - this.sale.paidAmount;
  }

  isFullyPaid(): boolean {
    if (!this.sale) return false;
    return this.sale.paidAmount >= this.sale.totalAmount;
  }

  downloadInvoice(): void {
    if (!this.sale) return;
    
    // Create invoice content
    const invoiceContent = this.generateInvoiceHTML();
    
    // Create a blob from the HTML
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${this.sale.saleCode}_${Date.now()}.html`;
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    
    console.log('Invoice downloaded:', this.sale.saleCode);
  }

  printInvoice(): void {
    if (!this.sale) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generateInvoiceHTML());
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }

  private generateInvoiceHTML(): string {
    if (!this.sale) return '';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${this.sale.saleCode}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .company-name { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
    .invoice-title { font-size: 20px; color: #666; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-box { width: 48%; }
    .info-label { font-weight: bold; color: #666; font-size: 12px; margin-bottom: 3px; }
    .info-value { font-size: 14px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background-color: #2563eb; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .total-section { margin-top: 30px; text-align: right; }
    .total-row { display: flex; justify-content: flex-end; padding: 8px 0; }
    .total-label { width: 150px; font-weight: bold; }
    .total-value { width: 150px; text-align: right; }
    .grand-total { font-size: 20px; color: #2563eb; border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
    .status-badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; }
    .paid { background-color: #dcfce7; color: #166534; }
    .pending { background-color: #fef3c7; color: #92400e; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">TAQDEER DOMESTIC WORKERS</div>
    <div class="invoice-title">INVOICE</div>
    <p style="margin: 10px 0; color: #666;">Invoice #: ${this.sale.saleCode}</p>
    <p style="margin: 5px 0; color: #666;">Date: ${this.formatDate(this.sale.createdDate)}</p>
  </div>

  <div class="info-section">
    <div class="info-box">
      <h3 style="color: #2563eb; margin-bottom: 15px;">SPONSOR INFORMATION</h3>
      <div class="info-label">Sponsor Name:</div>
      <div class="info-value">${this.sale.sponsorName}</div>
      
      <div class="info-label">Emirates ID:</div>
      <div class="info-value">${this.sale.sponsorEmirates}</div>
      
      <div class="info-label">Contact:</div>
      <div class="info-value">${this.sale.sponsorPhone}</div>
    </div>
    
    <div class="info-box">
      <h3 style="color: #2563eb; margin-bottom: 15px;">WORKER INFORMATION</h3>
      <div class="info-label">Worker Name:</div>
      <div class="info-value">${this.sale.workerName}</div>
      
      <div class="info-label">Passport No:</div>
      <div class="info-value">${this.sale.workerPassport}</div>
      
      <div class="info-label">Nationality:</div>
      <div class="info-value">${this.sale.workerNationality}</div>
      
      <div class="info-label">Job Type:</div>
      <div class="info-value">${this.sale.workerType}</div>
    </div>
  </div>

  <h3 style="color: #2563eb; margin-top: 30px; margin-bottom: 15px;">SALE DETAILS</h3>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Domestic Worker Placement Fee</td>
        <td style="text-align: right;">${this.formatCurrency(this.sale.totalAmount)}</td>
      </tr>
      <tr>
        <td>Contract Duration</td>
        <td style="text-align: right;">${this.sale.contractDuration} months</td>
      </tr>
      <tr>
        <td>Status</td>
        <td style="text-align: right;">
          <span class="status-badge ${this.isFullyPaid() ? 'paid' : 'pending'}">
            ${this.isFullyPaid() ? 'PAID' : 'PENDING'}
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-row">
      <div class="total-label">Total Amount:</div>
      <div class="total-value">${this.formatCurrency(this.sale.totalAmount)}</div>
    </div>
    <div class="total-row">
      <div class="total-label">Paid Amount:</div>
      <div class="total-value" style="color: #16a34a;">${this.formatCurrency(this.sale.paidAmount)}</div>
    </div>
    <div class="total-row">
      <div class="total-label">Remaining:</div>
      <div class="total-value" style="color: #dc2626;">${this.formatCurrency(this.getRemainingAmount())}</div>
    </div>
    <div class="total-row grand-total">
      <div class="total-label">Balance Due:</div>
      <div class="total-value">${this.formatCurrency(this.getRemainingAmount())}</div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Terms & Conditions:</strong></p>
    <p>6-month trial period | Full refund if return within trial | Proportional refund after trial</p>
    <p style="margin-top: 10px;">Thank you for choosing Taqdeer Domestic Workers!</p>
    <p>Contact: +971-XXX-XXXX | Email: info@taqdeer.ae</p>
  </div>
</body>
</html>
    `.trim();
  }
}