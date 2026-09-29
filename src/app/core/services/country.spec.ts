import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CountryService } from './country';
import { API_BASE_URL } from '../api/api-config';
import { mockCountries } from '../../testing/mock-data';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch countries from the mock API', () => {
    let result: unknown;
    service.getCountries().subscribe((countries) => (result = countries));

    const req = httpMock.expectOne(`${API_BASE_URL}/country`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);

    expect(result).toEqual(mockCountries);
  });

  it('should surface HTTP errors', () => {
    let errorMessage = '';
    service.getCountries().subscribe({
      error: (error: Error) => (errorMessage = error.message),
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/country`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(errorMessage).toContain('Request failed (404)');
  });
});
