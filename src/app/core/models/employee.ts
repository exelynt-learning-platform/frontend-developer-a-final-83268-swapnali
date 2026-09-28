export interface Employee {
  id: string;
  name: string;
  email: string;
  emailId?: string;
  mobile: string;
  /** Country name returned by the employee API (plain string). */
  country: string;
  state?: string;
  district?: string;
  avatar?: string;
  createdAt?: string;
}

/** Payload used when creating or updating an employee. */
export type EmployeePayload = Omit<Employee, 'id' | 'createdAt'>;
