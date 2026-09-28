import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Country } from '../models/country';

const COUNTRY_API_URL = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country';

/**
 * All country HTTP calls live here.
 * Ready for forms that need a country dropdown; the list page does not need it yet.
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
        ? 'Unable to reach the server. Check your network connection.'
        : `Request failed (${error.status}): ${error.message}`;

    return throwError(() => new Error(message));
  }
}
