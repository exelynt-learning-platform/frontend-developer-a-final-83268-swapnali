import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Employee, EmployeePayload } from '../../core/models/employee';

export const EmployeeActions = createActionGroup({
  source: 'Employee',
  events: {
    'Load Employees': emptyProps(),
    'Load Employees Success': props<{ employees: Employee[] }>(),
    'Load Employees Failure': props<{ error: string }>(),

    'Load Employee By Id': props<{ id: string }>(),
    'Load Employee By Id Success': props<{ employee: Employee }>(),
    'Load Employee By Id Failure': props<{ error: string; notFound: boolean }>(),

    'Create Employee': props<{ payload: EmployeePayload }>(),
    'Create Employee Success': props<{ employee: Employee }>(),
    'Create Employee Failure': props<{ error: string }>(),

    'Update Employee': props<{ id: string; payload: EmployeePayload }>(),
    'Update Employee Success': props<{ employee: Employee }>(),
    'Update Employee Failure': props<{ error: string }>(),

    'Delete Employee': props<{ id: string; name: string }>(),
    'Delete Employee Success': props<{ id: string; name: string }>(),
    'Delete Employee Failure': props<{ error: string }>(),

    'Set Search Id': props<{ searchId: string }>(),
    'Select Employee': props<{ id: string | null }>(),
    'Clear Employee Error': emptyProps(),
  },
});
