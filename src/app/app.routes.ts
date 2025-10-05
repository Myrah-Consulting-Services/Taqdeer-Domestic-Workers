import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UiReferenceComponent } from './pages/ui-reference/ui-reference.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ui-reference', component: UiReferenceComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
