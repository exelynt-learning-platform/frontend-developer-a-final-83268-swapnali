import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./employee-list/employee-list').then((m) => m.EmployeeList),
  },
];
