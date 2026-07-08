export interface TableColumn {
  field: string;
  label: string;
  type?: 'text' | 'badge' | 'color' | 'currency' | 'date' | 'boolean' | 'timemn' | 'timehr';
}