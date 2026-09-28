import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EmployeeFormValue } from '../../../core/models/employee-form';
import { EmployeePayload } from '../../../core/models/employee';
import { CountryActions } from '../../../store/country/country.actions';
import {
  selectAllCountries,
  selectCountriesLoading,
} from '../../../store/country/country.selectors';
import { EmployeeActions } from '../../../store/employee/employee.actions';
import {
  selectEmployeeById,
  selectEmployeeError,
  selectEmployeeLoading,
  selectSelectedEmployee,
} from '../../../store/employee/employee.selectors';
import { EmployeeFormComponent } from '../employee-form/employee-form';

/**
 * Smart page for Add + Edit.
 * Loads countries/employee from NgRx and dispatches create/update actions.
 */
@Component({
  selector: 'app-employee-form-page',
  imports: [
    AsyncPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    EmployeeFormComponent,
  ],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
})
export class EmployeeFormPage implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isEditMode = signal(false);
  readonly employeeId = signal<string | null>(null);
  /** Prevents double-submit while create/update is in flight. */
  readonly submitting = signal(false);
  readonly loadFailed = signal(false);

  readonly countries$ = this.store.select(selectAllCountries);
  readonly countriesLoading$ = this.store.select(selectCountriesLoading);
  readonly employeeLoading$ = this.store.select(selectEmployeeLoading);
  readonly employee$ = this.store.select(selectSelectedEmployee);
  readonly error$ = this.store.select(selectEmployeeError);

  constructor() {
    this.actions$
      .pipe(
        ofType(
          EmployeeActions.createEmployeeSuccess,
          EmployeeActions.updateEmployeeSuccess,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((action) => {
        this.submitting.set(false);
        const isCreate = action.type === EmployeeActions.createEmployeeSuccess.type;
        const message = isCreate
          ? `${action.employee.name} was added.`
          : `${action.employee.name} was updated.`;
        this.snackBar.open(message, 'Close', { duration: 3000 });
        void this.router.navigate(['/employees']);
      });

    this.actions$
      .pipe(
        ofType(
          EmployeeActions.createEmployeeFailure,
          EmployeeActions.updateEmployeeFailure,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(({ error }) => {
        this.submitting.set(false);
        this.snackBar.open(error, 'Close', { duration: 4000 });
      });

    this.actions$
      .pipe(ofType(EmployeeActions.loadEmployeeByIdFailure), takeUntilDestroyed())
      .subscribe(({ notFound, error }) => {
        this.loadFailed.set(true);
        this.snackBar.open(
          notFound ? 'Employee not found.' : error,
          'Close',
          { duration: 4000 },
        );
      });
  }

  ngOnInit(): void {
    this.store.dispatch(CountryActions.loadCountries());
    this.store.dispatch(EmployeeActions.clearEmployeeError());

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.employeeId.set(id);
      this.store.dispatch(EmployeeActions.selectEmployee({ id }));

      const existing = this.store.selectSignal(selectEmployeeById(id))();
      if (!existing) {
        this.store.dispatch(EmployeeActions.loadEmployeeById({ id }));
      }
    } else {
      this.isEditMode.set(false);
      this.employeeId.set(null);
      this.store.dispatch(EmployeeActions.selectEmployee({ id: null }));
    }
  }

  onSubmit(value: EmployeeFormValue): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    const payload: EmployeePayload = {
      name: value.name.trim(),
      email: value.email.trim(),
      emailId: value.email.trim(),
      mobile: value.mobile.trim(),
      country: value.country,
      state: value.state.trim(),
      district: value.district.trim(),
    };

    const id = this.employeeId();
    if (this.isEditMode() && id) {
      this.store.dispatch(EmployeeActions.updateEmployee({ id, payload }));
      return;
    }

    this.store.dispatch(EmployeeActions.createEmployee({ payload }));
  }

  onCancel(): void {
    void this.router.navigate(['/employees']);
  }
}
