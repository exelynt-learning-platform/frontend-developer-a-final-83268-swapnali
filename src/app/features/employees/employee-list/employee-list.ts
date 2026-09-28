import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { Employee } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee';

@Component({
  imports: [
    MatTableModule,
    MatButtonModule,
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
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['name', 'email', 'mobile', 'country', 'actions'];

  /** Full list from GET /employee (source of truth for the table). */
  private readonly employees = signal<Employee[]>([]);
  readonly searchId = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /**
   * Table data: either the full list, or rows whose id contains the search text.
   * Typing filters locally; pressing Enter runs an exact API lookup via getEmployeeById.
   */
  readonly filteredEmployees = computed(() => {
    const query = this.searchId().trim();
    const employees = this.employees();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) => employee.id.includes(query));
  });

  /** Search text is set, but no employee id matches. */
  readonly showNotFound = computed(
    () =>
      this.searchId().trim() !== '' &&
      this.filteredEmployees().length === 0 &&
      !this.loading() &&
      this.errorMessage() === null,
  );

  /** API succeeded and the employee collection is empty. */
  readonly showEmpty = computed(
    () =>
      this.searchId().trim() === '' &&
      this.employees().length === 0 &&
      !this.loading() &&
      this.errorMessage() === null,
  );

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Fetches all employees.
   * Flow: EmployeeService.getEmployees() → HttpClient GET → Observable → subscribe → employees signal → template.
   */
  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.employeeService
      .getEmployees()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (employees) => this.employees.set(employees),
        error: (error: Error) => {
          this.employees.set([]);
          this.errorMessage.set(error.message || 'Failed to load employees.');
        },
      });
  }

  /**
   * Exact ID search using GET /employee/:id (triggered by Enter).
   * 404-style failures surface as the not-found state.
   */
  searchById(): void {
    const id = this.searchId().trim();

    if (!id) {
      this.loadEmployees();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.employeeService
      .getEmployeeById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (employee) => this.employees.set([employee]),
        error: (error: Error) => {
          this.employees.set([]);
          if (error.message.includes('404')) {
            // Leave errorMessage null so showNotFound() can display.
            return;
          }
          this.errorMessage.set(error.message || 'Failed to search employee.');
        },
      });
  }

  onSearch(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const previous = this.searchId();
    this.searchId.set(input.value);

    // After an Enter-key exact search, clearing the box restores the full list.
    if (previous.trim() !== '' && input.value.trim() === '') {
      this.loadEmployees();
    }
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
    this.snackBar.open(`Edit ${employee.name} is not available yet.`, 'Close', { duration: 3000 });
  }

  deleteEmployee(employee: Employee): void {
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.employees.update((list) => list.filter((item) => item.id !== employee.id));
        this.snackBar.open(`${employee.name} was removed.`, 'Close', { duration: 3000 });
      },
      error: (error: Error) => {
        this.snackBar.open(error.message || 'Failed to delete employee.', 'Close', {
          duration: 4000,
        });
      },
    });
  }
}
