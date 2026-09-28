import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Employee } from '../../core/models/employee';
import { EmployeeActions } from './employee.actions';
import { EmployeeState } from './employee.state';

export const employeeAdapter: EntityAdapter<Employee> = createEntityAdapter<Employee>({
  selectId: (employee: Employee) => String(employee.id),
  sortComparer: (a: Employee, b: Employee) => Number(a.id) - Number(b.id),
});

export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  loading: false,
  error: null,
  selectedEmployeeId: null,
  searchId: '',
  searchNotFound: false,
  loaded: false,
});

export const employeeReducer = createReducer(
  initialEmployeeState,

  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null,
    searchNotFound: false,
  })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, {
      ...state,
      loading: false,
      error: null,
      loaded: true,
      searchNotFound: false,
    }),
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    loaded: false,
  })),

  on(EmployeeActions.loadEmployeeById, (state) => ({
    ...state,
    loading: true,
    error: null,
    searchNotFound: false,
  })),
  on(EmployeeActions.loadEmployeeByIdSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, {
      ...state,
      loading: false,
      error: null,
      searchNotFound: false,
      selectedEmployeeId: employee.id,
    }),
  ),
  on(EmployeeActions.loadEmployeeByIdFailure, (state, { error, notFound }) => ({
    ...state,
    loading: false,
    error: notFound ? null : error,
    searchNotFound: notFound,
    selectedEmployeeId: null,
  })),

  on(EmployeeActions.createEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, {
      ...state,
      loading: false,
      error: null,
      selectedEmployeeId: employee.id,
    }),
  ),
  on(EmployeeActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.updateOne(
      { id: employee.id, changes: employee },
      {
        ...state,
        loading: false,
        error: null,
        selectedEmployeeId: employee.id,
      },
    ),
  ),
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.deleteEmployee, (state) => ({
    ...state,
    error: null,
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
      selectedEmployeeId: state.selectedEmployeeId === id ? null : state.selectedEmployeeId,
    }),
  ),
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.setSearchId, (state, { searchId }) => ({
    ...state,
    searchId,
    // Clear API not-found as soon as the user edits the search box.
    searchNotFound: false,
  })),
  on(EmployeeActions.selectEmployee, (state, { id }) => ({
    ...state,
    selectedEmployeeId: id,
  })),
  on(EmployeeActions.clearEmployeeError, (state) => ({
    ...state,
    error: null,
  })),
);
