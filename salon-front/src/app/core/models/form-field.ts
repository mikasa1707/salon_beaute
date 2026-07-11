import { ValidatorFn } from '@angular/forms';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'color' | 'date' | 'time';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validators?: ValidatorFn[];
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  col?: 3 | 4 | 6 | 12;
}
