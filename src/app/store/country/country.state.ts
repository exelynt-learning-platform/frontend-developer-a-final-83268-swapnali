import { EntityState } from '@ngrx/entity';
import { Country } from '../../core/models/country';

/** Country feature state. Uses Entity for consistent id/entities storage. */
export interface CountryState extends EntityState<Country> {
  loading: boolean;
  error: string | null;
  loaded: boolean;
}
