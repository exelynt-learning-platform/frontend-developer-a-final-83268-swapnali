import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Country } from '../../core/models/country';
import { CountryActions } from './country.actions';
import { CountryState } from './country.state';

export const countryAdapter: EntityAdapter<Country> = createEntityAdapter<Country>({
  selectId: (country: Country) => country.id,
  sortComparer: (a: Country, b: Country) => a.country.localeCompare(b.country),
});

export const initialCountryState: CountryState = countryAdapter.getInitialState({
  loading: false,
  error: null,
  loaded: false,
});

export const countryReducer = createReducer(
  initialCountryState,

  on(CountryActions.loadCountries, (state) => {
    // Already in the store — keep state as-is so loading does not stick true.
    if (state.loaded) {
      return state;
    }
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(CountryActions.loadCountriesSuccess, (state, { countries }) =>
    countryAdapter.setAll(countries, {
      ...state,
      loading: false,
      error: null,
      loaded: true,
    }),
  ),
  on(CountryActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    loaded: false,
  })),
);
