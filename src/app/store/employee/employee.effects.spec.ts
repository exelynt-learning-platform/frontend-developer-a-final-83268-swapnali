import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { EmployeeEffects } from './employee.effects';
import { EmployeeActions } from './employee.actions';
import { EmployeeService } from '../../core/services/employee';
import { mockEmployee, mockEmployeePayload, mockEmployees } from '../../testing/mock-data';

describe('EmployeeEffects', () => {
  let actions$: Observable<Action>;
  let effects: EmployeeEffects;
  let employeeService: {
    getEmployees: ReturnType<typeof vi.fn>;
    getEmployeeById: ReturnType<typeof vi.fn>;
    createEmployee: ReturnType<typeof vi.fn>;
    updateEmployee: ReturnType<typeof vi.fn>;
    deleteEmployee: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    employeeService = {
      getEmployees: vi.fn(),
      getEmployeeById: vi.fn(),
      createEmployee: vi.fn(),
      updateEmployee: vi.fn(),
      deleteEmployee: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        EmployeeEffects,
        provideMockActions(() => actions$),
        { provide: EmployeeService, useValue: employeeService },
      ],
    });

    effects = TestBed.inject(EmployeeEffects);
  });

  it('loadEmployees$ should dispatch success with API data', () => {
    employeeService.getEmployees.mockReturnValue(of(mockEmployees));
    actions$ = of(EmployeeActions.loadEmployees());

    let result: Action | undefined;
    effects.loadEmployees$.subscribe((action) => (result = action));

    expect(employeeService.getEmployees).toHaveBeenCalled();
    expect(result).toEqual(EmployeeActions.loadEmployeesSuccess({ employees: mockEmployees }));
  });

  it('loadEmployees$ should dispatch failure when API errors', () => {
    employeeService.getEmployees.mockReturnValue(throwError(() => new Error('Network down')));
    actions$ = of(EmployeeActions.loadEmployees());

    let result: Action | undefined;
    effects.loadEmployees$.subscribe((action) => (result = action));

    expect(result).toEqual(
      EmployeeActions.loadEmployeesFailure({ error: 'Network down' }),
    );
  });

  it('createEmployee$ should dispatch success after POST', () => {
    const created = { ...mockEmployee, id: '9', ...mockEmployeePayload };
    employeeService.createEmployee.mockReturnValue(of(created));
    actions$ = of(EmployeeActions.createEmployee({ payload: mockEmployeePayload }));

    let result: Action | undefined;
    effects.createEmployee$.subscribe((action) => (result = action));

    expect(employeeService.createEmployee).toHaveBeenCalledWith(mockEmployeePayload);
    expect(result).toEqual(EmployeeActions.createEmployeeSuccess({ employee: created }));
  });

  it('deleteEmployee$ should dispatch success after DELETE', () => {
    employeeService.deleteEmployee.mockReturnValue(of(mockEmployee));
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1', name: mockEmployee.name }));

    let result: Action | undefined;
    effects.deleteEmployee$.subscribe((action) => (result = action));

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith('1');
    expect(result).toEqual(
      EmployeeActions.deleteEmployeeSuccess({ id: '1', name: mockEmployee.name }),
    );
  });

  it('loadEmployeeById$ should mark notFound on 404-style errors', () => {
    employeeService.getEmployeeById.mockReturnValue(
      throwError(() => new Error('Request failed (404): Not Found')),
    );
    actions$ = of(EmployeeActions.loadEmployeeById({ id: '99' }));

    let result: Action | undefined;
    effects.loadEmployeeById$.subscribe((action) => (result = action));

    expect(result).toEqual(
      EmployeeActions.loadEmployeeByIdFailure({
        error: 'Request failed (404): Not Found',
        notFound: true,
      }),
    );
  });
});
