export interface TableColumn {
  field: string;
  label: string;
  type?: 'string' | 'text' | 'badge' | 'color' | 'currency' | 'date' | 'boolean' | 'timemn' | 'timehr' | 'number';
  lowStock?: boolean;
}