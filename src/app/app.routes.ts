import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UiReferenceComponent } from './pages/ui-reference/ui-reference.component';
import { AgentsListComponent } from './pages/agents/agents-list/agents-list.component';
import { AgentDetailsComponent } from './pages/agents/agent-details/agent-details.component';
import { WorkersListComponent } from './pages/workers/workers-list/workers-list.component';
import { WorkerDetailsComponent } from './pages/workers/worker-details/worker-details.component';
import { SponsorsListComponent } from './pages/sponsors/sponsors-list/sponsors-list.component';
import { SponsorDetailsComponent } from './pages/sponsors/sponsor-details/sponsor-details.component';
import { EmployeesListComponent } from './pages/employees/employees-list/employees-list.component';
import { EmployeeDetailsComponent } from './pages/employees/employee-details/employee-details.component';
import { SalesDashboardComponent } from './pages/sales/sales-dashboard/sales-dashboard.component';
import { SalesListComponent } from './pages/sales/sales-list/sales-list.component';
import { SalesDetailsComponent } from './pages/sales/sales-details/sales-details.component';
import { AccountsFinanceDashboardComponent } from './pages/accounts-finance/accounts-finance-dashboard/accounts-finance-dashboard.component';
import { AccFinComponent } from './pages/acc-fin/acc-fin.component';
import { ExpensesComponent } from './pages/accounts-finance/expenses/expenses.component';
import { CommissionsComponent } from './pages/accounts-finance/commissions/commissions.component';
import { CreditDebitNotesComponent } from './pages/accounts-finance/credit-debit-notes/credit-debit-notes.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ui-reference', component: UiReferenceComponent },
      { path: 'agents', component: AgentsListComponent },
      { path: 'agents/:id', component: AgentDetailsComponent },
      { path: 'workers', component: WorkersListComponent },
      { path: 'workers/:id', component: WorkerDetailsComponent },
      { path: 'sponsors', component: SponsorsListComponent },
      { path: 'sponsors/:id', component: SponsorDetailsComponent },
      { path: 'employees', component: EmployeesListComponent },
      { path: 'employees/:id', component: EmployeeDetailsComponent },
      { path: 'sales', component: SalesListComponent },
      { path: 'sales/dashboard', component: SalesDashboardComponent },
      { path: 'sales/:id', component: SalesDetailsComponent },
      { path: 'accounts-finance', component: AccFinComponent },
      { path: 'acc-fin', component: AccFinComponent },
      { path: 'accounts-finance/expenses', component: ExpensesComponent },
      { path: 'accounts-finance/commissions', component: CommissionsComponent },
      { path: 'accounts-finance/credit-debit-notes', component: CreditDebitNotesComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'accounts-finance-dashboard', component: AccountsFinanceDashboardComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
