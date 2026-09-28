import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_BASE_URL } from '../api/api-config';
import { Employee, EmployeePayload } from '../models/employee';

const EMPLOYEE_API_URL = `${API_BASE_URL}/employee`;

/** json-server may return numeric ids — keep them as strings in the app. */
function normalizeEmployee(employee: Employee): Employee {
  return { ...employee, id: String(employee.id) };
}

/**
 * All employee HTTP calls live here.
 * NgRx Effects call these methods; components dispatch actions instead of using HttpClient.
 */
@Service()
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(EMPLOYEE_API_URL).pipe(
      map((employees) => employees.map(normalizeEmployee)),
      catchError(this.handleError),
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${EMPLOYEE_API_URL}/${id}`).pipe(
      map(normalizeEmployee),
      catchError(this.handleError),
    );
  }

  createEmployee(payload: EmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(EMPLOYEE_API_URL, payload).pipe(
      map(normalizeEmployee),
      catchError(this.handleError),
    );
  }

  updateEmployee(id: string, payload: EmployeePayload): Observable<Employee> {
    return this.http.put<Employee>(`${EMPLOYEE_API_URL}/${id}`, payload).pipe(
      map(normalizeEmployee),
      catchError(this.handleError),
    );
  }

  deleteEmployee(id: string): Observable<Employee> {
    return this.http.delete<Employee>(`${EMPLOYEE_API_URL}/${id}`).pipe(
      map(normalizeEmployee),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.status === 0
        ? 'Unable to reach the mock API. Run `npm run api` (port 3000) and try again.'
        : `Request failed (${error.status}): ${error.message}`;

    return throwError(() => new Error(message));
  }
}
