export interface TableColumn {
  field: string;
  label: string;
  type?: 'string' | 'text' | 'badge' | 'color' | 'currency' | 'date' | 'datehour' | 'boolean' | 'timemn' | 'timehr' | 'number'  | 'input-number';
  lowStock?: boolean;
  options?: {
    label: string;
    value: any;
  }[];
}