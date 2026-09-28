import { Component, effect, inject, input, output, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Country } from '../../../core/models/country';
import { Employee } from '../../../core/models/employee';
import { EmployeeFormValue } from '../../../core/models/employee-form';

/** Digits only, 10–15 characters (common mobile lengths). */
const MOBILE_PATTERN = /^[0-9]{10,15}$/;

/**
 * Presentational employee form.
 * Validation lives here; create/update API calls stay in the smart page + NgRx.
 */
@Component({
  selector: 'app-employee-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);

  /** Existing employee when editing; null when adding. */
  readonly employee = input<Employee | null>(null);
  readonly countries = input<Country[]>([]);
  readonly submitting = input(false);
  readonly submitLabel = input('Save');

  readonly formSubmit = output<EmployeeFormValue>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)],
    ],
    mobile: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern(MOBILE_PATTERN),
      ],
    ],
    country: ['', Validators.required],
    state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    district: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  constructor() {
    effect(() => {
      const employee = this.employee();
      untracked(() => this.patchFromEmployee(employee));
    });

    effect(() => {
      if (this.submitting()) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  controlError(controlName: keyof EmployeeFormValue): string | null {
    const control = this.form.controls[controlName];
    if (!control || !control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }
    if (control.errors['pattern']) {
      return 'Enter a valid mobile number (10–15 digits).';
    }
    if (control.errors['minlength']) {
      const required = control.errors['minlength'].requiredLength as number;
      return `Must be at least ${required} characters.`;
    }
    if (control.errors['maxlength']) {
      const required = control.errors['maxlength'].requiredLength as number;
      return `Must be at most ${required} characters.`;
    }

    return 'Invalid value.';
  }

  private patchFromEmployee(employee: Employee | null): void {
    if (!employee) {
      this.form.reset({
        name: '',
        email: '',
        mobile: '',
        country: '',
        state: '',
        district: '',
      });
      return;
    }

    this.form.patchValue({
      name: employee.name ?? '',
      email: employee.email ?? '',
      mobile: employee.mobile ?? '',
      country: employee.country ?? '',
      state: employee.state ?? '',
      district: employee.district ?? '',
    });
  }
}
