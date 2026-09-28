import { createFeatureSelector, createSelector } from '@ngrx/store';
import { countryAdapter } from './country.reducer';
import { CountryState } from './country.state';

export const selectCountryState = createFeatureSelector<CountryState>('countries');

const { selectAll, selectEntities, selectTotal } = countryAdapter.getSelectors();

export const selectAllCountries = createSelector(selectCountryState, selectAll);
export const selectCountryEntities = createSelector(selectCountryState, selectEntities);
export const selectCountryTotal = createSelector(selectCountryState, selectTotal);

export const selectCountriesLoading = createSelector(
  selectCountryState,
  (state) => state.loading,
);

export const selectCountriesError = createSelector(selectCountryState, (state) => state.error);

export const selectCountriesLoaded = createSelector(selectCountryState, (state) => state.loaded);
