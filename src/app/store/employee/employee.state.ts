import { EntityState } from '@ngrx/entity';
import { Employee } from '../../core/models/employee';

/**
 * Employee feature state.
 * EntityState provides ids + entities maps managed by the Entity Adapter.
 */
export interface EmployeeState extends EntityState<Employee> {
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  searchId: string;
  searchNotFound: boolean;
  loaded: boolean;
}
