import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { CountryService } from '../../core/services/country';
import { CountryActions } from './country.actions';
import { selectCountriesLoaded } from './country.selectors';

/**
 * Side effects for countries.
 * Skips a second API call when countries are already loaded.
 */
@Injectable()
export class CountryEffects {
  private readonly actions$ = inject(Actions);
  private readonly countryService = inject(CountryService);
  private readonly store = inject(Store);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.loadCountries),
      withLatestFrom(this.store.select(selectCountriesLoaded)),
      filter(([, loaded]) => !loaded),
      switchMap(() =>
        this.countryService.getCountries().pipe(
          map((countries) => CountryActions.loadCountriesSuccess({ countries })),
          catchError((error: Error) =>
            of(
              CountryActions.loadCountriesFailure({
                error: error.message || 'Failed to load countries.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
