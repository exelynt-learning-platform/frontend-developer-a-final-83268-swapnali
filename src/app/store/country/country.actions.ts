import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Country } from '../../core/models/country';

export const CountryActions = createActionGroup({
  source: 'Country',
  events: {
    'Load Countries': emptyProps(),
    'Load Countries Success': props<{ countries: Country[] }>(),
    'Load Countries Failure': props<{ error: string }>(),
  },
});
