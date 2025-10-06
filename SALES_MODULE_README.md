# 📊 SALES MODULE - TAQDEER DOMESTIC WORKERS

## Overview
Complete Sales Management System for tracking quotations, worker placements, trial periods, payments, refunds, and replacements according to UAE Ministry of Human Resources guidelines.

---

## 🎯 Key Features

### 1. **Sales Dashboard**
- **Location**: `/sales`
- **Purpose**: Comprehensive overview of all sales activities

#### Stats Cards:
- Total Sales Count
- Total Revenue (AED)
- Workers on Trial Period
- Pending Final Payments
- Pending Quotations
- Active Sales
- Refunded Cases
- Replaced Workers

#### Quick Views:
- **Recent Sales**: Last 5 sales with status
- **Trial Period Workers**: Currently on 6-month trial
- **Pending Payments**: Sales awaiting final payment for invoice generation

---

### 2. **Sales List** (Coming Next)
- **Location**: `/sales/list`
- **Features**:
  - Filter by status (Quotation, Trial, Confirmed, Refunded, Replaced)
  - Filter by nationality
  - Filter by payment status
  - Search by worker/sponsor name
  - Export to Excel/PDF
  - Bulk actions

---

### 3. **Sales Details** (Coming Next)
- **Location**: `/sales/:id`
- **Features**:
  - Complete sale information
  - Worker and sponsor details
  - Payment tracking
  - Trial period monitoring
  - Action buttons:
    - Record Advance Payment
    - Start Trial Period
    - Record Final Payment (generates invoice)
    - Process Refund
    - Process Replacement
    - Return Worker
    - Cancel Sale

---

## 💰 Pricing System (Ministry Defined)

```typescript
WORKER_PRICING = {
  'Ethiopia': AED 5,000
  'India': AED 12,000
  'Sri Lanka': AED 15,000
  'Nepal': AED 14,000
  'Philippines': AED 12,000
  'Bangladesh': AED 10,000
  'Indonesia': AED 11,000
  'Kenya': AED 8,000
  'Uganda': AED 8,000
}
```

### Payment Structure:
- **Advance Payment**: 50% of total amount
- **Final Payment**: Remaining 50%
- **Invoice Generation**: Only after final payment

---

## 📝 Sales Process Flow

### Step 1: Create Quotation
```
Worker Selected → Interview Passed → Generate Quotation
Status: "quotation"
```

### Step 2: Advance Payment
```
Sponsor Agrees → Record Advance Payment (50%)
Status: "quotation" → Payment Status: "advance-paid"
```

### Step 3: Start Trial Period
```
Worker Delivered → Start Trial (6 months)
Status: "trial"
Contract: 2 years from this date
```

### Step 4: Final Payment & Invoice
```
Sponsor Satisfied → Record Final Payment → Generate Invoice
Status: "confirmed"
Payment Status: "fully-paid"
Invoice Number: Generated automatically
```

---

## 🔄 Return, Refund & Replacement

### Return Within Trial Period (First 6 months):
Sponsor can:
1. **Select Another Worker** (Replacement)
2. **Request Refund** (Proportional calculation)

### Refund Calculation Formula:
```
Monthly Rate = Total Amount ÷ 24 months
Amount for Worked Period = Monthly Rate × Months Worked
Refundable Amount = Total Amount - Amount for Worked Period
```

### Full Refund Cases:
- Worker Illness
- Worker Pregnancy
- Worker Absconded

**Example Calculation:**
```
Worker: Ethiopia (AED 5,000)
Contract: 24 months
Worked: 2 months

Monthly Rate = 5,000 ÷ 24 = AED 208.33
Amount for 2 months = 208.33 × 2 = AED 416.66
Refundable Amount = 5,000 - 416.66 = AED 4,583.34
```

---

## 📊 Data Models

### Sale Model
```typescript
{
  id: string
  saleCode: string              // SAL001, SAL002
  
  // Worker Details
  workerId: string
  workerName: string
  workerPassport: string
  workerNationality: string
  workerType: string            // housemaid, cook, cleaner, etc.
  
  // Sponsor Details
  sponsorId: string
  sponsorName: string
  sponsorEmirates: string
  sponsorPhone: string
  
  // Agent (if applicable)
  agentId?: string
  agentName?: string
  agentCommission?: number
  
  // Interview
  interviewDate?: string
  interviewResult?: 'selected' | 'rejected' | 'pending'
  
  // Trial Period
  trialStartDate?: string
  trialEndDate?: string         // 6 months from start
  isOnTrial: boolean
  trialStatus?: 'ongoing' | 'completed' | 'returned'
  
  // Pricing
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
  paidAmount: number
  
  // Payment
  paymentStatus: 'advance-paid' | 'fully-paid' | 'refunded' | 'pending'
  advancePaymentDate?: string
  finalPaymentDate?: string
  
  // Documents
  quotationNumber?: string      // QUO-2024-001
  invoiceNumber?: string        // INV-2024-001
  
  // Contract
  contractStartDate?: string
  contractEndDate?: string      // 2 years from start
  contractDuration: 24          // months
  
  // Status
  status: 'quotation' | 'trial' | 'confirmed' | 'refunded' | 'replaced' | 'cancelled'
  
  // Refund/Return
  returnDate?: string
  returnReason?: string
  refundAmount?: number
  replacementWorkerId?: string
}
```

---

## 🎨 Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| Quotation | Yellow | Quotation generated, awaiting advance payment |
| Trial | Blue | Worker on 6-month trial period |
| Confirmed | Green | Fully paid, invoice generated |
| Refunded | Red | Money refunded to sponsor |
| Replaced | Purple | Worker replaced with another |
| Cancelled | Gray | Sale cancelled |

---

## 🔐 Role-Based Access

### Admin
- View all sales
- Create sales
- Record payments
- Generate invoices
- Process refunds
- Process replacements
- Full access

### Sales Executive
- View assigned sales
- Create sales
- Record payments
- Generate quotations
- Limited access

### Receptionist
- View sales (read-only)
- Cannot create or modify

---

## 📈 Reports (Future Enhancement)

### Sales Reports:
1. Monthly Sales Report
2. Revenue Analysis
3. Worker Nationality Analysis
4. Refund Analysis
5. Trial Period Success Rate
6. Agent Commission Report
7. Outstanding Payments Report

---

## 🚀 Next Steps

1. ✅ Sales Dashboard (Completed)
2. ⏳ Sales List Component (Next)
3. ⏳ Sales Details Component
4. ⏳ Create Sale Form
5. ⏳ Payment Recording Modals
6. ⏳ Refund Calculator
7. ⏳ Invoice Generator
8. ⏳ Quotation Generator
9. ⏳ Reports Module

---

## 💡 Usage Examples

### Creating a New Sale:
1. Navigate to Sales Dashboard
2. Click "New Sale" button
3. Select Worker and Sponsor
4. System auto-calculates pricing based on nationality
5. Generate Quotation

### Recording Payments:
1. Go to Sale Details
2. Click "Record Advance Payment"
3. Enter amount, method, and date
4. System updates payment status

### Processing Refund:
1. Go to Sale Details
2. Click "Process Refund"
3. Enter months worked
4. System calculates refundable amount
5. Select reason (performance/illness/pregnancy/absconded)
6. Confirm refund

---

## 📱 Mobile Responsive
All sales components are fully responsive and work seamlessly on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

---

## 🔗 Navigation
- **Dashboard**: `/dashboard` → Click "Sales" in header
- **Sales Dashboard**: `/sales`
- **Sales List**: `/sales/list`
- **Sale Details**: `/sales/SAL001`

---

## 📞 Support
For any questions or issues related to the Sales Module, contact the development team.

---

*Last Updated: March 2024*
*Version: 1.0.0*

