import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { EmployeeService } from '../../core/services/employee';
import { EmployeeActions } from './employee.actions';

/**
 * Side effects for employees.
 * Effects listen for actions, call EmployeeService, then dispatch success/failure actions.
 * Reducers never call the API — only Effects do.
 */
@Injectable()
export class EmployeeEffects {
  private readonly actions$ = inject(Actions);
  private readonly employeeService = inject(EmployeeService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      switchMap(() =>
        this.employeeService.getEmployees().pipe(
          map((employees) => EmployeeActions.loadEmployeesSuccess({ employees })),
          catchError((error: Error) =>
            of(
              EmployeeActions.loadEmployeesFailure({
                error: error.message || 'Failed to load employees.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeById),
      switchMap(({ id }) =>
        this.employeeService.getEmployeeById(id).pipe(
          map((employee) => EmployeeActions.loadEmployeeByIdSuccess({ employee })),
          catchError((error: Error) => {
            const message = error.message || 'Failed to load employee.';
            const notFound = message.includes('404');
            return of(
              EmployeeActions.loadEmployeeByIdFailure({
                error: message,
                notFound,
              }),
            );
          }),
        ),
      ),
    ),
  );

  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      switchMap(({ payload }) =>
        this.employeeService.createEmployee(payload).pipe(
          map((employee) => EmployeeActions.createEmployeeSuccess({ employee })),
          catchError((error: Error) =>
            of(
              EmployeeActions.createEmployeeFailure({
                error: error.message || 'Failed to create employee.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      switchMap(({ id, payload }) =>
        this.employeeService.updateEmployee(id, payload).pipe(
          map((employee) => EmployeeActions.updateEmployeeSuccess({ employee })),
          catchError((error: Error) =>
            of(
              EmployeeActions.updateEmployeeFailure({
                error: error.message || 'Failed to update employee.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      switchMap(({ id, name }) =>
        this.employeeService.deleteEmployee(id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id, name })),
          catchError((error: Error) =>
            of(
              EmployeeActions.deleteEmployeeFailure({
                error: error.message || 'Failed to delete employee.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
