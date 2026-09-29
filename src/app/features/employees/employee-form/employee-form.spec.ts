import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form';
import { mockCountries, mockEmployee } from '../../../testing/mock-data';

describe('EmployeeFormComponent', () => {
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let component: EmployeeFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('countries', mockCountries);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should require all fields', () => {
    component.form.patchValue({
      name: '',
      email: '',
      mobile: '',
      country: '',
      state: '',
      district: '',
    });
    component.form.markAllAsTouched();

    expect(component.form.controls.name.hasError('required')).toBe(true);
    expect(component.form.controls.email.hasError('required')).toBe(true);
    expect(component.form.controls.mobile.hasError('required')).toBe(true);
    expect(component.form.controls.country.hasError('required')).toBe(true);
    expect(component.form.controls.state.hasError('required')).toBe(true);
    expect(component.form.controls.district.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    component.form.controls.email.setValue('not-an-email');
    component.form.controls.email.markAsTouched();

    expect(component.form.controls.email.hasError('email')).toBe(true);
    expect(component.controlError('email')).toBe('Enter a valid email address.');
  });

  it('should validate mobile as 10-15 digits', () => {
    component.form.controls.mobile.setValue('12345');
    component.form.controls.mobile.markAsTouched();

    expect(component.form.controls.mobile.invalid).toBe(true);
    expect(component.controlError('mobile')).toBeTruthy();

    component.form.controls.mobile.setValue('9876543210');
    expect(component.form.controls.mobile.valid).toBe(true);
  });

  it('should enforce name min length', () => {
    component.form.controls.name.setValue('A');
    component.form.controls.name.markAsTouched();

    expect(component.form.controls.name.hasError('minlength')).toBe(true);
    expect(component.controlError('name')).toContain('at least 2');
  });

  it('should emit form values on valid submit', () => {
    const emitSpy = vi.fn();
    component.formSubmit.subscribe(emitSpy);

    component.form.setValue({
      name: 'Anika Sharma',
      email: 'anika.sharma@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'KA',
      district: 'Bengaluru',
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Anika Sharma',
      email: 'anika.sharma@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'KA',
      district: 'Bengaluru',
    });
  });

  it('should not emit when form is invalid', () => {
    const emitSpy = vi.fn();
    component.formSubmit.subscribe(emitSpy);

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.form.touched).toBe(true);
  });

  it('should patch values when editing an employee', () => {
    fixture.componentRef.setInput('employee', mockEmployee);
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({
      name: mockEmployee.name,
      email: mockEmployee.email,
      mobile: mockEmployee.mobile,
      country: mockEmployee.country,
      state: mockEmployee.state,
      district: mockEmployee.district,
    });
  });

  it('should emit cancelled when cancel is clicked', () => {
    const emitSpy = vi.fn();
    component.cancelled.subscribe(emitSpy);

    component.onCancel();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not submit while submitting is true', () => {
    const emitSpy = vi.fn();
    component.formSubmit.subscribe(emitSpy);

    component.form.setValue({
      name: 'Anika Sharma',
      email: 'anika.sharma@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'KA',
      district: 'Bengaluru',
    });
    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
