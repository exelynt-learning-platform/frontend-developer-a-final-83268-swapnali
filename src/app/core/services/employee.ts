import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Employee, EmployeePayload } from '../models/employee';

const EMPLOYEE_API_URL = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee';

/**
 * All employee HTTP calls live here.
 * Components subscribe to the returned Observables; they never call HttpClient directly.
 */
@Service()
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(EMPLOYEE_API_URL).pipe(catchError(this.handleError));
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http
      .get<Employee>(`${EMPLOYEE_API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createEmployee(payload: EmployeePayload): Observable<Employee> {
    return this.http
      .post<Employee>(EMPLOYEE_API_URL, payload)
      .pipe(catchError(this.handleError));
  }

  updateEmployee(id: string, payload: EmployeePayload): Observable<Employee> {
    return this.http
      .put<Employee>(`${EMPLOYEE_API_URL}/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteEmployee(id: string): Observable<Employee> {
    return this.http
      .delete<Employee>(`${EMPLOYEE_API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.status === 0
        ? 'Unable to reach the server. Check your network connection.'
        : `Request failed (${error.status}): ${error.message}`;

    return throwError(() => new Error(message));
  }
}
