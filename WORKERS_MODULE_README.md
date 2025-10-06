# 👷 Workers Management Module - Taqdeer Domestic Workers

## 🎯 Overview
Complete workers management system with role-based access control. Agents can only see and manage their own workers, while admins have full access.

## ✨ Key Features

### 📊 **Worker Information**
- Personal details (Name, DOB, Age, Nationality, Gender)
- Passport & Visa tracking
- Worker type (Housemaid, Cleaner, Cook, Babysitter, Driver, Gardener)
- Experience and skills
- Languages spoken

### 🔄 **Worker Status Tracking**
1. **Available** - Worker ready for placement
2. **Interview** - Interview scheduled with sponsor
3. **Trial** - On trial with sponsor (test period)
4. **Placed** - Successfully placed with sponsor
5. **Returned** - Returned by sponsor
6. **Absconded** - Worker absconded

### 💰 **Financial Management**
- Package amount based on nationality:
  - Ethiopia: AED 5,000
  - India: AED 12,000
  - Sri Lanka: AED 15,000
  - Nepal: AED 14,000
  - Philippines: AED 12,000
  - Bangladesh: AED 10,000
  - Indonesia: AED 11,000
  - Kenya: AED 8,000
  - Uganda: AED 7,000
- Advance payment tracking
- Remaining amount calculation
- Commission tracking per agent

### 👥 **Role-Based Access**

#### **Admin View:**
- ✅ View ALL workers (all agents)
- ✅ Add workers for any agent
- ✅ Edit/Delete any worker
- ✅ View all statistics
- ✅ Manage placements
- ✅ Track all commissions

#### **Agent View:**
- ✅ View ONLY their workers
- ✅ Add workers to their account
- ✅ Edit their workers
- ✅ View their workers' status
- ✅ Track their commission
- ❌ Cannot see other agents' workers
- ❌ Cannot see system-wide stats

## 📱 Components Created

### 1. **Workers List** (`/workers`)
- Stats dashboard
- Search & filter functionality
- Status-based filtering
- Comprehensive worker table
- Modal-based actions (Add/Edit/View)

### 2. **Worker Form Modal**
- Personal information
- Passport & visa details
- Worker type & skills
- Agent assignment (auto for agents)
- Medical status

### 3. **Worker Details Modal**
- Complete worker profile
- Timeline tracking
- Sponsor information (if placed)
- Financial summary
- Status history

## 📋 Worker Data Model

```typescript
Worker {
  workerCode: 'W001'
  fullName: 'Fatima Hassan'
  nationality: 'Ethiopia'
  workerType: 'housemaid'
  passportNumber: 'ET1234567'
  visaDetails: {...}
  agentId: '1' // Linked to agent
  currentStatus: 'available'
  packageAmount: 5000
  contractDetails: {...}
}
```

## 🔗 Integration with Agents

- Each worker linked to an agent via `agentId`
- Agent commission automatically calculated
- Worker count reflects in agent statistics
- Commission tracking per worker

## 🎨 User Interface

### **Stats Cards:**
- Total Workers
- Available
- On Interview
- On Trial
- Placed
- Returned

### **Filters:**
- Search by name, passport, worker code
- Filter by status
- Filter by nationality
- Filter by worker type

### **Table Columns:**
- Worker Details (Photo, Name, Code)
- Nationality & Type
- Passport & Visa Status
- Current Status
- Agent (Admin view only)
- Package Amount
- Actions

## 🚀 Usage

### **Admin Login → Workers:**
1. See all workers from all agents
2. Add worker and assign to any agent
3. Manage placements
4. Track all commissions

### **Agent Login → Workers:**
1. See only their workers
2. Add new workers (auto-assigned to their account)
3. Update worker status
4. Track their workers' placements

## 📝 Next Steps

### Phase 1: ✅ **Current**
- Workers list with role-based filtering
- Add/Edit/View workers
- Status management
- Basic stats

### Phase 2: 🔄 **Coming Next**
- Sponsor Management module
- Placement workflow
- Trial period tracking
- Payment processing

### Phase 3: 📊 **Future**
- Commission reports
- Worker performance tracking
- Contract management
- Refund calculations

## 🔒 Security & Permissions

```typescript
Agent Permissions:
- canViewOwnWorkers: true
- canManageWorkers: true (only their workers)
- canViewAllWorkers: false

Admin Permissions:
- canViewAllWorkers: true
- canManageWorkers: true (all workers)
- canAssignAgents: true
```

## 💡 Business Logic

### **Worker Lifecycle:**
1. Agent adds worker → Status: Available
2. Sponsor interviews → Status: Interview
3. Sponsor takes on trial → Status: Trial
4. Sponsor confirms → Status: Placed
5. If issues → Status: Returned/Absconded

### **Payment Flow:**
1. Worker arrives → Advance paid
2. Trial period → No invoice yet
3. Sponsor confirms → Remaining payment
4. Payment complete → Invoice generated
5. Commission paid to agent

### **Return Policy:**
- Within 6 months: Replacement or refund
- Proportional refund calculation
- Full refund: Illness, pregnancy, absconding
- Credit/Debit notes in accounts

## 📞 Testing

**Admin Login:**
```
Username: admin
Password: admin123
→ View all workers from all agents
```

**Agent Login (AG001):**
```
Username: agent001
Password: agent123
→ See only workers from AG001
→ Can add workers (auto-assigned to AG001)
```

**Agent Login (AG002):**
```
Username: agent002  
Password: agent123
→ See only workers from AG002
→ Different set of workers
```

---

**Status:** 🚧 In Progress
**Next:** Workers List Component Implementation


