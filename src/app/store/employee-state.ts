import { Employee } from '../core/models/employee';

/**
 * Reserved for a future store.
 * NgRx is not installed yet; the list loads employees from EmployeeService (HttpClient).
 */
export interface EmployeeState {
  employees: Employee[];
  searchId: string;
  loading: boolean;
  error: string | null;
}
