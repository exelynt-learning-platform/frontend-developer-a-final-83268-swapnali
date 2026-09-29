import { employeeReducer, initialEmployeeState } from './employee.reducer';
import { EmployeeActions } from './employee.actions';
import { mockEmployee, mockEmployees } from '../../testing/mock-data';

describe('employeeReducer', () => {
  it('should set loading on loadEmployees', () => {
    const state = employeeReducer(initialEmployeeState, EmployeeActions.loadEmployees());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should store employees on loadEmployeesSuccess', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, loading: true },
      EmployeeActions.loadEmployeesSuccess({ employees: mockEmployees }),
    );

    expect(state.loading).toBe(false);
    expect(state.loaded).toBe(true);
    expect(state.ids).toEqual(['1', '2']);
    expect(state.entities['1']).toEqual(mockEmployees[0]);
  });

  it('should store error on loadEmployeesFailure', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, loading: true },
      EmployeeActions.loadEmployeesFailure({ error: 'Failed' }),
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed');
    expect(state.loaded).toBe(false);
  });

  it('should add an employee on createEmployeeSuccess', () => {
    const loaded = employeeReducer(
      initialEmployeeState,
      EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee] }),
    );
    const created = { ...mockEmployee, id: '3', name: 'New Person' };
    const state = employeeReducer(
      loaded,
      EmployeeActions.createEmployeeSuccess({ employee: created }),
    );

    expect(state.ids).toContain('3');
    expect(state.selectedEmployeeId).toBe('3');
  });

  it('should update an employee on updateEmployeeSuccess', () => {
    const loaded = employeeReducer(
      initialEmployeeState,
      EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee] }),
    );
    const updated = { ...mockEmployee, name: 'Anika Updated' };
    const state = employeeReducer(
      loaded,
      EmployeeActions.updateEmployeeSuccess({ employee: updated }),
    );

    expect(state.entities['1']?.name).toBe('Anika Updated');
  });

  it('should remove an employee on deleteEmployeeSuccess', () => {
    const loaded = employeeReducer(
      initialEmployeeState,
      EmployeeActions.loadEmployeesSuccess({ employees: mockEmployees }),
    );
    const state = employeeReducer(
      { ...loaded, selectedEmployeeId: '1' },
      EmployeeActions.deleteEmployeeSuccess({ id: '1', name: mockEmployee.name }),
    );

    expect(state.ids).toEqual(['2']);
    expect(state.entities['1']).toBeUndefined();
    expect(state.selectedEmployeeId).toBeNull();
  });

  it('should update searchId and clear searchNotFound', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, searchNotFound: true },
      EmployeeActions.setSearchId({ searchId: '2' }),
    );

    expect(state.searchId).toBe('2');
    expect(state.searchNotFound).toBe(false);
  });

  it('should mark not-found when load by id fails with notFound', () => {
    const state = employeeReducer(
      initialEmployeeState,
      EmployeeActions.loadEmployeeByIdFailure({ error: '404', notFound: true }),
    );

    expect(state.searchNotFound).toBe(true);
    expect(state.error).toBeNull();
    expect(state.loading).toBe(false);
  });
});
