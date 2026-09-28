import { createFeatureSelector, createSelector } from '@ngrx/store';
import { employeeAdapter } from './employee.reducer';
import { EmployeeState } from './employee.state';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

const { selectAll, selectEntities, selectTotal } = employeeAdapter.getSelectors();

export const selectAllEmployees = createSelector(selectEmployeeState, selectAll);
export const selectEmployeeEntities = createSelector(selectEmployeeState, selectEntities);
export const selectEmployeeTotal = createSelector(selectEmployeeState, selectTotal);

export const selectEmployeeLoading = createSelector(
  selectEmployeeState,
  (state) => state.loading,
);

export const selectEmployeeError = createSelector(selectEmployeeState, (state) => state.error);

export const selectEmployeeSearchId = createSelector(
  selectEmployeeState,
  (state) => state.searchId,
);

export const selectSelectedEmployeeId = createSelector(
  selectEmployeeState,
  (state) => state.selectedEmployeeId,
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntities,
  selectSelectedEmployeeId,
  (entities, selectedId) => (selectedId ? (entities[selectedId] ?? null) : null),
);

export const selectEmployeeById = (id: string) =>
  createSelector(selectEmployeeEntities, (entities) => entities[id] ?? null);

export const selectEmployeeLoaded = createSelector(selectEmployeeState, (state) => state.loaded);

export const selectSearchNotFound = createSelector(
  selectEmployeeState,
  (state) => state.searchNotFound,
);

/** Applies the search-id filter to the entity collection. */
export const selectFilteredEmployees = createSelector(
  selectAllEmployees,
  selectEmployeeSearchId,
  (employees, searchId) => {
    const query = searchId.trim();
    if (!query) {
      return employees;
    }

    // Coerce id to string — json-server may return numeric ids.
    return employees.filter((employee) => String(employee.id).includes(query));
  },
);

export const selectShowEmployeeNotFound = createSelector(
  selectEmployeeSearchId,
  selectFilteredEmployees,
  selectEmployeeLoading,
  selectEmployeeError,
  selectSearchNotFound,
  (searchId, filtered, loading, error, searchNotFound) =>
    !loading &&
    error === null &&
    searchId.trim() !== '' &&
    (searchNotFound || filtered.length === 0),
);

export const selectShowEmployeesEmpty = createSelector(
  selectEmployeeSearchId,
  selectEmployeeTotal,
  selectEmployeeLoading,
  selectEmployeeError,
  (searchId, total, loading, error) =>
    !loading && error === null && searchId.trim() === '' && total === 0,
);
