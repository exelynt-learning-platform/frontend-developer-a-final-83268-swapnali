import { Routes } from '@angular/router';
import { employeeRoutes } from './features/employees/employees.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  ...employeeRoutes,
  { path: '**', redirectTo: 'employees' },
];
