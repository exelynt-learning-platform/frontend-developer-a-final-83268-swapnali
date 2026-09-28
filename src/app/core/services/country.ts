import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_BASE_URL } from '../api/api-config';
import { Country } from '../models/country';

const COUNTRY_API_URL = `${API_BASE_URL}/country`;

/**
 * All country HTTP calls live here.
 * NgRx CountryEffects call these methods; components dispatch CountryActions.
 */
@Service()
export class CountryService {
  private readonly http = inject(HttpClient);

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(COUNTRY_API_URL).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.status === 0
        ? 'Unable to reach the mock API. Run `npm run api` (port 3000) and try again.'
        : `Request failed (${error.status}): ${error.message}`;

    return throwError(() => new Error(message));
  }
}
