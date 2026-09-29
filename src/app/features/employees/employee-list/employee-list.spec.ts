import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { EmployeeList } from './employee-list';
import { EmployeeActions } from '../../../store/employee/employee.actions';
import { CountryActions } from '../../../store/country/country.actions';
import {
  selectEmployeeError,
  selectEmployeeLoading,
  selectFilteredEmployees,
  selectShowEmployeeNotFound,
  selectShowEmployeesEmpty,
} from '../../../store/employee/employee.selectors';
import { mockEmployee, mockEmployees } from '../../../testing/mock-data';

describe('EmployeeList', () => {
  let fixture: ComponentFixture<EmployeeList>;
  let component: EmployeeList;
  let store: MockStore;
  let router: Router;
  let dialogOpen: ReturnType<typeof vi.fn>;
  let snackBar: { open: ReturnType<typeof vi.fn> };
  let actionsSubject: Subject<unknown>;

  beforeEach(async () => {
    snackBar = { open: vi.fn() };
    actionsSubject = new Subject();
    dialogOpen = vi.fn().mockReturnValue({ afterClosed: () => of(true) });

    await TestBed.configureTestingModule({
      imports: [EmployeeList],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectFilteredEmployees, value: mockEmployees },
            { selector: selectEmployeeLoading, value: false },
            { selector: selectEmployeeError, value: null },
            { selector: selectShowEmployeeNotFound, value: false },
            { selector: selectShowEmployeesEmpty, value: false },
          ],
        }),
        { provide: Actions, useValue: actionsSubject },
        { provide: MatDialog, useValue: { open: dialogOpen } },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    })
      .overrideProvider(MatDialog, { useValue: { open: dialogOpen } })
      .compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    vi.spyOn(store, 'dispatch');
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(EmployeeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    actionsSubject.complete();
    store.resetSelectors();
  });

  it('should create and dispatch load actions on init', () => {
    expect(component).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(EmployeeActions.loadEmployees());
    expect(store.dispatch).toHaveBeenCalledWith(CountryActions.loadCountries());
  });

  it('should render employee rows from the store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Anika Sharma');
    expect(compiled.textContent).toContain('Liam Johnson');
  });

  it('should dispatch setSearchId when searching', () => {
    const input = document.createElement('input');
    input.value = '2';
    component.onSearch({ target: input } as unknown as Event);

    expect(component.searchId()).toBe('2');
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.setSearchId({ searchId: '2' }),
    );
  });

  it('should dispatch loadEmployeeById on Enter search', () => {
    component.searchId.set('1');
    component.searchById();

    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.loadEmployeeById({ id: '1' }),
    );
  });

  it('should navigate to add employee page', () => {
    component.addEmployee();
    expect(router.navigate).toHaveBeenCalledWith(['/employees/new']);
  });

  it('should navigate to edit page and select employee', () => {
    component.editEmployee(mockEmployee);

    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.selectEmployee({ id: mockEmployee.id }),
    );
    expect(router.navigate).toHaveBeenCalledWith([
      '/employees',
      mockEmployee.id,
      'edit',
    ]);
  });

  it('should dispatch delete only after dialog confirmation', () => {
    dialogOpen.mockReturnValue({ afterClosed: () => of(true) });

    component.deleteEmployee(mockEmployee);

    expect(dialogOpen).toHaveBeenCalled();
    expect(component.deletingId()).toBe(mockEmployee.id);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.deleteEmployee({
        id: mockEmployee.id,
        name: mockEmployee.name,
      }),
    );
  });

  it('should not delete when dialog is cancelled', () => {
    dialogOpen.mockReturnValue({ afterClosed: () => of(false) });
    const dispatchSpy = store.dispatch as unknown as ReturnType<typeof vi.fn>;
    dispatchSpy.mockClear();

    component.deleteEmployee(mockEmployee);

    expect(store.dispatch).not.toHaveBeenCalledWith(
      EmployeeActions.deleteEmployee({
        id: mockEmployee.id,
        name: mockEmployee.name,
      }),
    );
  });

  it('should show snackbar on delete success', () => {
    actionsSubject.next(
      EmployeeActions.deleteEmployeeSuccess({
        id: mockEmployee.id,
        name: mockEmployee.name,
      }),
    );

    expect(snackBar.open).toHaveBeenCalledWith(
      `${mockEmployee.name} was removed.`,
      'Close',
      { duration: 3000 },
    );
    expect(component.deletingId()).toBeNull();
  });

  it('should show loading state', () => {
    store.overrideSelector(selectEmployeeLoading, true);
    store.overrideSelector(selectFilteredEmployees, []);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading employees...');
  });

  it('should show empty state', () => {
    store.overrideSelector(selectEmployeeLoading, false);
    store.overrideSelector(selectShowEmployeesEmpty, true);
    store.overrideSelector(selectFilteredEmployees, []);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No employees available.');
  });
});
