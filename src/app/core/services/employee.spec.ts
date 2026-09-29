import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EmployeeService } from './employee';
import { API_BASE_URL } from '../api/api-config';
import { mockEmployee, mockEmployeePayload, mockEmployees } from '../../testing/mock-data';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const baseUrl = `${API_BASE_URL}/employee`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch employees and normalize ids to strings', () => {
    let result: unknown;
    service.getEmployees().subscribe((employees) => (result = employees));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([{ ...mockEmployee, id: 1 as unknown as string }, mockEmployees[1]]);

    expect(result).toEqual([
      { ...mockEmployee, id: '1' },
      mockEmployees[1],
    ]);
  });

  it('should fetch one employee by id', () => {
    let result: unknown;
    service.getEmployeeById('1').subscribe((employee) => (result = employee));

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);

    expect(result).toEqual(mockEmployee);
  });

  it('should create an employee', () => {
    const created = { ...mockEmployee, id: '9', ...mockEmployeePayload };
    let result: unknown;
    service.createEmployee(mockEmployeePayload).subscribe((employee) => (result = employee));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockEmployeePayload);
    req.flush(created);

    expect(result).toEqual(created);
  });

  it('should update an employee', () => {
    const updated = { ...mockEmployee, name: 'Updated Name' };
    let result: unknown;
    service
      .updateEmployee('1', { ...mockEmployeePayload, name: 'Updated Name' })
      .subscribe((employee) => (result = employee));

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    expect(result).toEqual(updated);
  });

  it('should delete an employee', () => {
    let result: unknown;
    service.deleteEmployee('1').subscribe((employee) => (result = employee));

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockEmployee);

    expect(result).toEqual(mockEmployee);
  });

  it('should map HTTP errors to readable messages', () => {
    let errorMessage = '';
    service.getEmployees().subscribe({
      error: (error: Error) => (errorMessage = error.message),
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });

    expect(errorMessage).toContain('Request failed (500)');
  });

  it('should map network failures (status 0) clearly', () => {
    let errorMessage = '';
    service.getEmployeeById('99').subscribe({
      error: (error: Error) => (errorMessage = error.message),
    });

    const req = httpMock.expectOne(`${baseUrl}/99`);
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(errorMessage).toContain('Unable to reach the mock API');
  });
});
