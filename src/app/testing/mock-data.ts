import { Employee } from '../core/models/employee';
import { Country } from '../core/models/country';
import { EmployeePayload } from '../core/models/employee';

export const mockEmployee: Employee = {
  id: '1',
  name: 'Anika Sharma',
  email: 'anika.sharma@example.com',
  emailId: 'anika.sharma@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'KA',
  district: 'Bengaluru',
};

export const mockEmployees: Employee[] = [
  mockEmployee,
  {
    id: '2',
    name: 'Liam Johnson',
    email: 'liam.johnson@example.com',
    mobile: '4155550134',
    country: 'United States',
    state: 'CA',
    district: 'San Francisco',
  },
];

export const mockCountries: Country[] = [
  {
    id: '1',
    country: 'India',
    flag: 'https://flagcdn.com/w80/in.png',
  },
  {
    id: '2',
    country: 'United States',
    flag: 'https://flagcdn.com/w80/us.png',
  },
];

export const mockEmployeePayload: EmployeePayload = {
  name: 'New Employee',
  email: 'new.employee@example.com',
  emailId: 'new.employee@example.com',
  mobile: '9998887776',
  country: 'India',
  state: 'MH',
  district: 'Pune',
};
