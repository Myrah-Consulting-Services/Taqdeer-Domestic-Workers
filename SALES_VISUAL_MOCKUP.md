# 📱 SALES MODULE - VISUAL MOCKUP
## What Sales List & Details Should Show

---

## 📊 SALES LIST VIEW (Enhanced)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                    SALES LIST                     + New Sale  │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  Quick Stats:                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ 🔴 EXPIRED   │  │ 🟡 EXPIRING  │  │ 🔵 ON TRIAL  │  │ ✅ CONFIRMED │         │
│  │ 3 Visas      │  │ 7 in 7 days  │  │ 12 Workers   │  │ 45 Workers   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  Filters:                                                                           │
│  🔍 Search: [________________]  📋 Status: [All ▾]  🛂 Visa: [All ▾]             │
│  👤 Worker Type: [All ▾]  🌍 Nationality: [All ▾]  📅 Date: [Last 30 Days ▾]     │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  📋 Sales by Worker (52)  |  👥 Sales by Sponsor (48)                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                                     │
│  ╔══════════════════════════════════════════════════════════════════════════════╗ │
│  ║ WORKER      │ NATIONALITY │ VISA STATUS     │ TRIAL      │ SPONSOR    │ $   ║ │
│  ╠══════════════════════════════════════════════════════════════════════════════╣ │
│  ║ [A] Fatima  │ Ethiopia    │ 🔴 EXPIRED      │ On Trial   │ Ahmed      │ 5K  ║ │
│  ║ ID: W001    │ Housemaid   │ Overstay: 5 days│ Day 45/180 │ Al Maktoum │     ║ │
│  ║             │ 5yr exp     │ ⚠️ ACTION REQ!  │ 🔵 Ongoing │ [View]     │[...] ║ │
│  ╟──────────────────────────────────────────────────────────────────────────────╢ │
│  ║ [R] Priya   │ India       │ 🟡 Expiring     │ Trial Done │ Mohammed   │ 12K ║ │
│  ║ ID: W002    │ Cook        │ 5 days left     │ ✅ Success │ Al Nahyan  │     ║ │
│  ║             │ 3yr exp     │ Visit Visa      │ Confirmed  │ [View]     │[...] ║ │
│  ╟──────────────────────────────────────────────────────────────────────────────╢ │
│  ║ [M] Maya    │ Philippines │ 🟢 Valid        │ Not Started│ At Office  │ 12K ║ │
│  ║ ID: W003    │ Babysitter  │ 45 days left    │ Pending    │ Available  │     ║ │
│  ║             │ 8yr exp     │ Visit Visa      │ Quotation  │ [View]     │[...] ║ │
│  ╟──────────────────────────────────────────────────────────────────────────────╢ │
│  ║ [A] Amara   │ Sri Lanka   │ 🟢 Valid        │ On Trial   │ Rashid     │ 15K ║ │
│  ║ ID: W004    │ Housemaid   │ 120 days left   │ Day 12/180 │ Al Falasi  │     ║ │
│  ║             │ 2yr exp     │ Visit Visa      │ 🔵 Ongoing │ [View]     │[...] ║ │
│  ╟──────────────────────────────────────────────────────────────────────────────╢ │
│  ║ [S] Sunita  │ Nepal       │ 🟢 Valid        │ Returned   │ Omar       │ 14K ║ │
│  ║ ID: W005    │ Cleaner     │ 90 days left    │ ❌ Failed  │ Al Ali     │     ║ │
│  ║             │ 4yr exp     │ Visit Visa      │ Refund Req │ [View]     │[...] ║ │
│  ╚══════════════════════════════════════════════════════════════════════════════╝ │
│                                                                                     │
│  Showing 1-5 of 52 workers                              [1] [2] [3] ... [11] [→]  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Columns Explained:

1. **WORKER**: Name, ID, Experience
2. **NATIONALITY**: Country, Worker Type (Housemaid/Cook/etc), Experience years
3. **VISA STATUS**: 
   - 🔴 RED = Expired (with overstay days)
   - 🟡 YELLOW = Expiring soon (< 7 days)
   - 🟢 GREEN = Valid (days remaining)
   - Visa Type (Visit/Work)
4. **TRIAL**: 
   - Status (Not Started, On Trial, Completed, Returned)
   - Progress (Day X/180 for 6 months)
   - Result (Success/Failed/Ongoing)
5. **SPONSOR**: Name, ID, View button
6. **$**: Package amount (5K, 12K, 15K based on nationality)
7. **Actions**: View Details, Edit, Delete

---

## 📄 SALES DETAILS VIEW (Enhanced)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to List                    SALE: SAL-001                    [Dashboard ↗]  │
│                                                                                     │
│  Fatima Hassan → Ahmed Al Maktoum                            🔴 ON TRIAL           │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  💰 PAYMENT PROGRESS                                                               │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  AED 2,500 paid of AED 5,000 total                             50% Complete    ││
│  │  ████████████████████░░░░░░░░░░░░░░░░░░░░░░                                    ││
│  │                                                                                 ││
│  │  ⚠️ Remaining: AED 2,500 - Invoice will generate after full payment            ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  Tabs:                                                                              │
│  [Overview] [Visa & Arrival] [Trial Tracking] [Contract] [Payments] [Documents]   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                                     │
│  📋 OVERVIEW TAB                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  Sale Code: SAL-001                Status: 🔵 On Trial                         ││
│  │  Created: Jan 5, 2025              Last Updated: Jan 15, 2025                  ││
│  │                                                                                 ││
│  │  👷 WORKER INFORMATION                                                          ││
│  │  ├─ Name: Fatima Hassan                                                        ││
│  │  ├─ ID: W001                                                                   ││
│  │  ├─ Passport: E1234567                                                         ││
│  │  ├─ Nationality: Ethiopia                                                      ││
│  │  ├─ Type: Housemaid                                                            ││
│  │  ├─ Age: 28 years                                                              ││
│  │  └─ Experience: 5 years                                                        ││
│  │                                                                                 ││
│  │  👤 SPONSOR INFORMATION                                                         ││
│  │  ├─ Name: Ahmed Al Maktoum                                                     ││
│  │  ├─ ID: S001                                                                   ││
│  │  ├─ Emirates ID: 784-XXXX-XXXXXXX-X                                            ││
│  │  ├─ Phone: +971 50 123 4567                                                    ││
│  │  ├─ Email: ahmed@example.ae                                                    ││
│  │  └─ Location: Dubai                                                            ││
│  │                                                                                 ││
│  │  🏢 AGENT INFORMATION (Optional)                                                ││
│  │  ├─ Agent: Global Recruitment Services                                         ││
│  │  ├─ Agent ID: AG001                                                            ││
│  │  ├─ Commission: AED 500 (10%)                                                  ││
│  │  └─ Status: ⏳ Pending Payment                                                  ││
│  │                                                                                 ││
│  │  💵 FINANCIAL SUMMARY                                                           ││
│  │  ├─ Worker Nationality: Ethiopia                                               ││
│  │  ├─ Ministry Fixed Price: AED 5,000                                            ││
│  │  ├─ Advance Paid: AED 2,500 (50%)                                              ││
│  │  ├─ Remaining: AED 2,500                                                       ││
│  │  └─ Payment Status: 🟡 Advance Paid                                            ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  🛂 VISA & ARRIVAL TAB                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  ✈️ ARRIVAL INFORMATION                                                         ││
│  │  ├─ Arrival Date: Dec 28, 2024                                                 ││
│  │  ├─ Airport: Dubai International (DXB)                                         ││
│  │  ├─ Flight: EK 604 from Addis Ababa                                            ││
│  │  ├─ Picked up by: Mohammed (Staff ID: E012)                                    ││
│  │  └─ Days at Office: 8 days                                                     ││
│  │                                                                                 ││
│  │  🛂 VISA INFORMATION                                                            ││
│  │  ├─ Visa Type: Visit Visa (30 days)                                            ││
│  │  ├─ Visa Number: VIS-2024-123456                                               ││
│  │  ├─ Issue Date: Dec 15, 2024                                                   ││
│  │  ├─ Expiry Date: Jan 27, 2025                                                  ││
│  │  ├─ Days Remaining: 🔴 -5 DAYS (OVERSTAY!)                                     ││
│  │  ├─ Visa Sponsor: Taqdeer Domestic Workers                                     ││
│  │  └─ Immigration File: IMG-2024-001                                             ││
│  │                                                                                 ││
│  │  ⚠️ ALERT: Visa expired 5 days ago! Immediate action required!                 ││
│  │  [Process Visa Extension] [Convert to Work Visa]                               ││
│  │                                                                                 ││
│  │  📍 CURRENT LOCATION                                                            ││
│  │  ├─ Status: 🏠 With Sponsor (On Trial)                                         ││
│  │  ├─ Address: Villa 123, Palm Jumeirah, Dubai                                   ││
│  │  ├─ Moved to Sponsor: Jan 10, 2025                                             ││
│  │  └─ Days with Sponsor: 5 days                                                  ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  🔄 TRIAL TRACKING TAB                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  📅 INTERVIEW & SELECTION                                                       ││
│  │  Worker arrived at office: Dec 28, 2024                                        ││
│  │  Days at office before interview: 8 days                                       ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │  Interview Date: Jan 8, 2025                                                   ││
│  │  Sponsor: Ahmed Al Maktoum                                                     ││
│  │  Interview Result: ✅ SELECTED                                                  ││
│  │  Sponsor Feedback: "Very experienced, polite, speaks some English"             ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │  Selection Date: Jan 8, 2025 (same day)                                        ││
│  │  Taken home for trial: Jan 10, 2025                                            ││
│  │                                                                                 ││
│  │  🔵 TRIAL PERIOD (6 MONTHS = 180 DAYS)                                          ││
│  │  Trial Start: Jan 10, 2025                                                     ││
│  │  Trial End: Jul 10, 2025                                                       ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │  Days Completed: 5 / 180 days (3%)                                             ││
│  │  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 3%                     ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │  Status: 🔵 ONGOING                                                             ││
│  │                                                                                 ││
│  │  ✅ CHECK-IN MILESTONES                                                         ││
│  │  ├─ Week 1 (Jan 17):  ⏳ Pending (Due in 2 days) [Schedule Call]               ││
│  │  ├─ Week 2 (Jan 24):  ⏳ Pending                                                ││
│  │  ├─ Month 1 (Feb 10): ⏳ Pending                                                ││
│  │  ├─ Month 2 (Mar 10): ⏳ Pending                                                ││
│  │  ├─ Month 3 (Apr 10): ⏳ Pending                                                ││
│  │  └─ Month 6 (Jul 10): ⏳ Pending (Final Check)                                  ││
│  │                                                                                 ││
│  │  📝 PERFORMANCE NOTES                                                           ││
│  │  ┌────────────────────────────────────────────────────────────────────────────┐││
│  │  │ No feedback recorded yet. First check-in scheduled for Jan 17, 2025.       │││
│  │  └────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                 ││
│  │  [Record Check-in] [Report Issue] [Schedule Follow-up]                         ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  📋 CONTRACT TAB                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  📄 CONTRACT DETAILS (2 YEARS = 24 MONTHS)                                      ││
│  │  Contract Start: Jan 10, 2025 (Trial start date)                               ││
│  │  Contract End: Jan 10, 2027 (2 years later)                                    ││
│  │  Contract Duration: 24 months                                                  ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │  Status: ⏳ In Trial Period (First 6 months)                                    ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │                                                                                 ││
│  │  ⚖️ REFUND CALCULATOR (If Return Needed)                                        ││
│  │  ┌────────────────────────────────────────────────────────────────────────────┐││
│  │  │  Contract Terms & Refund Policy:                                           │││
│  │  │                                                                             │││
│  │  │  Total Contract Value: AED 5,000                                           │││
│  │  │  Contract Duration: 24 months                                              │││
│  │  │  Monthly Rate: AED 208.33 (5000 ÷ 24)                                      │││
│  │  │                                                                             │││
│  │  │  SCENARIO 1: Normal Return (After Trial Period)                            │││
│  │  │  If worker returned after working for [X] months:                          │││
│  │  │  ┌─────────────────────────────────────────────────────────┐              │││
│  │  │  │ Enter months worked: [__] months                        │              │││
│  │  │  │ ─────────────────────────────────────────               │              │││
│  │  │  │ Amount for worked period: AED [calculated]              │              │││
│  │  │  │ Refundable Amount: AED [calculated]                     │              │││
│  │  │  │                                                          │              │││
│  │  │  │ Example: If worked 10 months                            │              │││
│  │  │  │ • Worked period value: AED 2,083 (208.33 × 10)          │              │││
│  │  │  │ • Refund: AED 2,917 (5,000 - 2,083)                     │              │││
│  │  │  └─────────────────────────────────────────────────────────┘              │││
│  │  │                                                                             │││
│  │  │  SCENARIO 2: Special Cases (FULL REFUND)                                   │││
│  │  │  ☑️ Worker became ill                                                       │││
│  │  │  ☑️ Worker became pregnant                                                  │││
│  │  │  ☑️ Worker absconded                                                        │││
│  │  │  If any checked: Full Refund = AED 5,000                                   │││
│  │  │                                                                             │││
│  │  │  SCENARIO 3: Return During Trial (First 6 Months)                          │││
│  │  │  • Sponsor can return worker and select another                            │││
│  │  │  • OR request full refund                                                  │││
│  │  │  • No deduction for trial period                                           │││
│  │  │                                                                             │││
│  │  │  [Calculate Refund] [Process Return] [Request Replacement]                 │││
│  │  └────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                 ││
│  │  📊 CONTRACT PROGRESS (After Trial Confirmed)                                   ││
│  │  Months Completed: 0 / 24 months                                               ││
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%                        ││
│  │  (Will activate after trial confirmation)                                      ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  💰 PAYMENTS TAB                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  💵 PAYMENT BREAKDOWN                                                           ││
│  │  Worker Nationality: Ethiopia                                                  ││
│  │  Ministry Fixed Price: AED 5,000                                               ││
│  │  ──────────────────────────────────────────────────────────────────────────────││
│  │  Total Amount: AED 5,000                                                       ││
│  │  Advance (50%): AED 2,500                                                      ││
│  │  Final Payment: AED 2,500                                                      ││
│  │                                                                                 ││
│  │  📊 PAYMENT STATUS                                                              ││
│  │  Total Paid: AED 2,500                                                         ││
│  │  Balance Due: AED 2,500                                                        ││
│  │  Status: 🟡 Advance Paid                                                        ││
│  │                                                                                 ││
│  │  📝 PAYMENT HISTORY                                                             ││
│  │  ┌────────────────────────────────────────────────────────────────────────────┐││
│  │  │  ✅ ADVANCE PAYMENT                                                         │││
│  │  │  Date: Jan 9, 2025                                                         │││
│  │  │  Amount: AED 2,500                                                         │││
│  │  │  Method: Bank Transfer                                                     │││
│  │  │  Receipt #: RCP-001                                                        │││
│  │  │  Received by: Fatima Ahmed (Employee ID: E005)                             │││
│  │  │  Quotation: QUO-001                                                        │││
│  │  │  ─────────────────────────────────────────────────────────                │││
│  │  │  [View Receipt] [Download]                                                 │││
│  │  └────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                 ││
│  │  ┌────────────────────────────────────────────────────────────────────────────┐││
│  │  │  ⏳ FINAL PAYMENT (Pending)                                                 │││
│  │  │  Amount Due: AED 2,500                                                     │││
│  │  │  Expected: After trial confirmation                                        │││
│  │  │  Status: ⏳ Awaiting trial completion                                       │││
│  │  │  ─────────────────────────────────────────────────────────                │││
│  │  │  [Record Payment] (Disabled until trial confirmed)                         │││
│  │  └────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                 ││
│  │  📄 INVOICE GENERATION                                                          ││
│  │  ⚠️ Invoice will only be generated after full payment is received              ││
│  │  Status: ❌ Not Available (Payment incomplete)                                  ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  📁 DOCUMENTS TAB                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  📋 DOCUMENT CHECKLIST                                                          ││
│  │  ┌────────────────────────────────────────────────────────────────────────────┐││
│  │  │  ✅ Worker Passport Copy          [View] [Download]                        │││
│  │  │  ✅ Visa Copy                     [View] [Download]                        │││
│  │  │  ⏳ Emirates ID (Pending)         [Upload]                                 │││
│  │  │  ✅ Medical Certificate           [View] [Download]                        │││
│  │  │  ✅ Police Clearance              [View] [Download]                        │││
│  │  │  ✅ Quotation (QUO-001)           [View] [Download]                        │││
│  │  │  ⏳ Contract (Pending)            [Generate] [Upload]                      │││
│  │  │  ❌ Invoice (Not Generated)       (Available after full payment)           │││
│  │  │  ✅ Advance Receipt (RCP-001)     [View] [Download]                        │││
│  │  │  ⏳ Final Receipt (Pending)       [Upload]                                 │││
│  │  │  ✅ Sponsor Emirates ID           [View] [Download]                        │││
│  │  │  ✅ Agent Agreement (AG001)       [View] [Download]                        │││
│  │  └────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                 ││
│  │  [Upload New Document] [Bulk Download]                                         ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│  📅 ACTIVITY TIMELINE TAB                                                           │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │  Complete chronological history of this sale:                                  ││
│  │                                                                                 ││
│  │  ● Dec 28, 2024, 3:45 PM                                                       ││
│  │    ✈️ Worker arrived at Dubai International Airport                            ││
│  │    Flight: EK 604 from Addis Ababa                                             ││
│  │    Picked up by: Mohammed (Staff E012)                                         ││
│  │                                                                                 ││
│  │  ● Dec 29, 2024, 10:30 AM                                                      ││
│  │    📝 Worker registered in system                                               ││
│  │    Added by: Receptionist Sarah (E003)                                         ││
│  │    Worker ID: W001                                                             ││
│  │    Passport: E1234567                                                          ││
│  │                                                                                 ││
│  │  ● Jan 5, 2025, 2:15 PM                                                        ││
│  │    💰 Quotation generated                                                       ││
│  │    Quotation #: QUO-001                                                        ││
│  │    Amount: AED 5,000                                                           ││
│  │    Generated by: Sales Agent Ali (E007)                                        ││
│  │                                                                                 ││
│  │  ● Jan 8, 2025, 11:00 AM                                                       ││
│  │    🤝 Interview scheduled with sponsor                                          ││
│  │    Sponsor: Ahmed Al Maktoum                                                   ││
│  │    Scheduled by: Sales Agent Ali (E007)                                        ││
│  │                                                                                 ││
│  │  ● Jan 8, 2025, 3:30 PM                                                        ││
│  │    ✅ Interview completed - SELECTED                                            ││
│  │    Result: Worker selected by sponsor                                          ││
│  │    Feedback: "Very experienced, good attitude"                                 ││
│  │    Updated by: Sales Agent Ali (E007)                                          ││
│  │                                                                                 ││
│  │  ● Jan 9, 2025, 10:00 AM                                                       ││
│  │    💵 Advance payment received                                                  ││
│  │    Amount: AED 2,500 (50%)                                                     ││
│  │    Method: Bank Transfer                                                       ││
│  │    Receipt: RCP-001                                                            ││
│  │    Received by: Accounts Fatima (E005)                                         ││
│  │                                                                                 ││
│  │  ● Jan 10, 2025, 9:00 AM                                                       ││
│  │    🏠 Worker sent to sponsor home (TRIAL STARTED)                               ││
│  │    Trial Start Date: Jan 10, 2025                                              ││
│  │    Trial End Date: Jul 10, 2025 (6 months)                                     ││
│  │    Address: Villa 123, Palm Jumeirah                                           ││
│  │    Transported by: Driver Hassan (E015)                                        ││
│  │    Updated by: Operations Layla (E009)                                         ││
│  │                                                                                 ││
│  │  ● Jan 15, 2025, 2:00 PM                                                       ││
│  │    📝 System accessed                                                           ││
│  │    Viewed by: You                                                              ││
│  │    Current Status: On Trial (Day 5/180)                                        ││
│  │                                                                                 ││
│  │  [Export Timeline] [Print]                                                     ││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                     │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 ALERT SYSTEM EXAMPLES

### Visa Expiry Alerts
```
┌────────────────────────────────────────────────────┐
│ 🔴 CRITICAL ALERT: VISA EXPIRED                    │
│ ─────────────────────────────────────────────────  │
│ Worker: Fatima Hassan (W001)                       │
│ Visa expired: 5 days ago                          │
│ Current Status: With Sponsor (On Trial)           │
│                                                    │
│ ACTION REQUIRED:                                   │
│ • Process visa extension immediately               │
│ • Or convert to work visa                         │
│ • Update Operations team                          │
│                                                    │
│ [Take Action] [Dismiss] [Remind Later]            │
└────────────────────────────────────────────────────┘
```

### Trial Check-in Reminder
```
┌────────────────────────────────────────────────────┐
│ 🔔 REMINDER: TRIAL CHECK-IN DUE                    │
│ ─────────────────────────────────────────────────  │
│ Worker: Priya Kumar (W002)                         │
│ Sponsor: Mohammed Al Nahyan                        │
│ Check-in: Week 1 (Due: Tomorrow)                   │
│                                                    │
│ ACTION:                                            │
│ • Call sponsor to check satisfaction               │
│ • Record feedback in system                       │
│                                                    │
│ [Schedule Call] [Record Check-in] [Snooze]        │
└────────────────────────────────────────────────────┘
```

### Payment Pending Alert
```
┌────────────────────────────────────────────────────┐
│ 💰 PAYMENT PENDING                                 │
│ ─────────────────────────────────────────────────  │
│ Sale: SAL-005                                      │
│ Worker: Maya Santos (W003)                         │
│ Sponsor: Rashid Al Falasi                          │
│ Trial Status: ✅ Completed (Satisfied)              │
│ Pending Amount: AED 6,000                          │
│                                                    │
│ ACTION:                                            │
│ • Contact sponsor for final payment                │
│ • Generate invoice after payment                  │
│                                                    │
│ [Contact Sponsor] [Record Payment] [View Details] │
└────────────────────────────────────────────────────┘
```

---

## 📊 DASHBOARD WIDGETS

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SALES DASHBOARD                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐│
│  │ 📊 WORKERS    │  │ 🛂 VISA ALERTS│  │ 🔵 TRIAL      │  │ 💰 MONEY ││
│  │               │  │               │  │               │  │          ││
│  │ Available: 8  │  │ 🔴 Expired: 3 │  │ On Trial: 12  │  │ Revenue: ││
│  │ On Trial: 12  │  │ 🟡 Expiring: 7│  │ Success: 45   │  │ 180K AED ││
│  │ Working: 45   │  │ 🟢 Valid: 45  │  │ Returned: 5   │  │          ││
│  │ Returned: 5   │  │               │  │               │  │ Pending: ││
│  │               │  │ [View All]    │  │ [View All]    │  │ 45K AED  ││
│  └───────────────┘  └───────────────┘  └───────────────┘  └──────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ 📈 SALES PIPELINE                                                   ││
│  │                                                                     ││
│  │ Quotations (10)  →  On Trial (12)  →  Confirmed (45)               ││
│  │     [View]              [View]             [View]                  ││
│  │                                                                     ││
│  │ Returns (5) → Refunds (3) → Replacements (2)                       ││
│  │   [View]        [View]         [View]                              ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ ⚠️ URGENT ACTIONS REQUIRED                                          ││
│  │                                                                     ││
│  │ 🔴 3 Visa Overstays - Need immediate attention                     ││
│  │ 🟡 7 Check-ins due this week                                       ││
│  │ 💰 5 Final payments pending                                        ││
│  │ 📞 2 Sponsor complaints to address                                 ││
│  │                                                                     ││
│  │ [View All Alerts]                                                  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY HIGHLIGHTS FOR DEMO

When showing this to Taqdeer management, emphasize:

1. ✅ **Simple & Clean** - Not cluttered like RightERP
2. ✅ **Domestic Worker Focused** - Every feature is relevant
3. ✅ **Visa Tracking** - Automatic alerts, no manual checking
4. ✅ **Trial Management** - Clear 6-month tracking
5. ✅ **Automatic Refund Calculator** - Based on actual months worked
6. ✅ **Payment Tracking** - Know exactly what's pending
7. ✅ **Ministry Compliant** - Pre-configured pricing
8. ✅ **No Confusion** - Invoice only after full payment
9. ✅ **Real-time Status** - Always know where workers are
10. ✅ **Complete History** - Full timeline of every transaction

---

This mockup shows EXACTLY what your Sales module should display based on Taqdeer's business requirements!

