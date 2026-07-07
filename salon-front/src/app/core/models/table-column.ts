export interface TableColumn {
  field: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'currency';
}