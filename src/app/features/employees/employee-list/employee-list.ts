import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { Employee } from '../../../core/models/employee';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/confirm-dialog/confirm-dialog';
import { CountryActions } from '../../../store/country/country.actions';
import { EmployeeActions } from '../../../store/employee/employee.actions';
import {
  selectEmployeeError,
  selectEmployeeLoading,
  selectFilteredEmployees,
  selectShowEmployeeNotFound,
  selectShowEmployeesEmpty,
} from '../../../store/employee/employee.selectors';

@Component({
  imports: [
    AsyncPipe,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-employee-list',
  styleUrl: './employee-list.scss',
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns = ['employeeId', 'name', 'email', 'mobile', 'country', 'actions'];

  /** Local input value — avoids fighting the store via [value] + async pipe. */
  readonly searchId = signal('');

  readonly employees$ = this.store.select(selectFilteredEmployees);
  readonly loading$ = this.store.select(selectEmployeeLoading);
  readonly error$ = this.store.select(selectEmployeeError);
  readonly showNotFound$ = this.store.select(selectShowEmployeeNotFound);
  readonly showEmpty$ = this.store.select(selectShowEmployeesEmpty);

  constructor() {
    this.actions$
      .pipe(ofType(EmployeeActions.deleteEmployeeSuccess), takeUntilDestroyed())
      .subscribe(({ name }) => {
        this.snackBar.open(`${name} was removed.`, 'Close', { duration: 3000 });
      });

    this.actions$
      .pipe(ofType(EmployeeActions.deleteEmployeeFailure), takeUntilDestroyed())
      .subscribe(({ error }) => {
        this.snackBar.open(error, 'Close', { duration: 4000 });
      });
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
    this.store.dispatch(CountryActions.loadCountries());
  }

  loadEmployees(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  onSearch(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const value = input.value;
    this.searchId.set(value);
    this.store.dispatch(EmployeeActions.setSearchId({ searchId: value }));
  }

  /** Exact ID lookup (Search button or Enter). */
  searchById(): void {
    const id = this.searchId().trim();
    this.store.dispatch(EmployeeActions.setSearchId({ searchId: id }));

    if (!id) {
      this.loadEmployees();
      return;
    }

    this.store.dispatch(EmployeeActions.loadEmployeeById({ id }));
  }

  clearSearch(): void {
    this.searchId.set('');
    this.store.dispatch(EmployeeActions.setSearchId({ searchId: '' }));
    this.loadEmployees();
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchById();
    }
  }

  addEmployee(): void {
    this.snackBar.open('Add employee is not available yet.', 'Close', { duration: 3000 });
  }

  editEmployee(employee: Employee): void {
    this.store.dispatch(EmployeeActions.selectEmployee({ id: employee.id }));
    this.snackBar.open(`Edit ${employee.name} is not available yet.`, 'Close', { duration: 3000 });
  }

  deleteEmployee(employee: Employee): void {
    const data: ConfirmDialogData = {
      title: 'Delete employee',
      message: `Are you sure you want to delete "${employee.name}" (ID ${employee.id})? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    };

    this.dialog
      .open(ConfirmDialog, { data, width: '400px' })
      .afterClosed()
      .pipe(filter((confirmed): confirmed is true => confirmed === true))
      .subscribe(() => {
        this.store.dispatch(
          EmployeeActions.deleteEmployee({ id: employee.id, name: employee.name }),
        );
      });
  }
}
