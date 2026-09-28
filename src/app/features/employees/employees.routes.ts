import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./employee-list/employee-list').then((m) => m.EmployeeList),
  },
  {
    path: 'employees/new',
    loadComponent: () =>
      import('./employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
  {
    path: 'employees/:id/edit',
    loadComponent: () =>
      import('./employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
];
