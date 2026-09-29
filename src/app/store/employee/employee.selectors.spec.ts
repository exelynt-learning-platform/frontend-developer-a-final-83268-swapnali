import {
  selectFilteredEmployees,
  selectShowEmployeeNotFound,
  selectShowEmployeesEmpty,
} from './employee.selectors';
import { employeeAdapter, initialEmployeeState } from './employee.reducer';
import { EmployeeState } from './employee.state';
import { mockEmployees } from '../../testing/mock-data';

function buildState(overrides: Partial<EmployeeState> = {}): { employees: EmployeeState } {
  const withEmployees = employeeAdapter.setAll(mockEmployees, {
    ...initialEmployeeState,
    loaded: true,
  });

  return {
    employees: {
      ...withEmployees,
      ...overrides,
    },
  };
}

describe('employee selectors', () => {
  it('selectFilteredEmployees should return all when search is empty', () => {
    const result = selectFilteredEmployees.projector(mockEmployees, '');
    expect(result).toEqual(mockEmployees);
  });

  it('selectFilteredEmployees should filter by id substring', () => {
    const result = selectFilteredEmployees.projector(mockEmployees, '2');
    expect(result).toEqual([mockEmployees[1]]);
  });

  it('selectShowEmployeeNotFound should be true when search has no matches', () => {
    const result = selectShowEmployeeNotFound.projector('99', [], false, null, false);
    expect(result).toBe(true);
  });

  it('selectShowEmployeeNotFound should be false while loading', () => {
    const result = selectShowEmployeeNotFound.projector('99', [], true, null, false);
    expect(result).toBe(false);
  });

  it('selectShowEmployeesEmpty should be true when list is empty and not searching', () => {
    const result = selectShowEmployeesEmpty.projector('', 0, false, null);
    expect(result).toBe(true);
  });

  it('selectShowEmployeesEmpty should be false when employees exist', () => {
    const result = selectShowEmployeesEmpty.projector('', 2, false, null);
    expect(result).toBe(false);
  });

  it('should read filtered employees from store shape', () => {
    const state = buildState({ searchId: '1' });
    expect(selectFilteredEmployees(state)).toEqual([mockEmployees[0]]);
  });
});
