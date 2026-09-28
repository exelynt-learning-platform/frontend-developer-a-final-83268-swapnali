import { EmployeeState } from './employee/employee.state';
import { CountryState } from './country/country.state';

/** Root application state shape registered with provideStore. */
export interface AppState {
  employees: EmployeeState;
  countries: CountryState;
}
