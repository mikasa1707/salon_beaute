export interface PrintSection {
  title?: string;

  type: 'INFO' | 'TABLE' | 'TOTAL' | 'TEXT';

  columns?: {
    label: string;
    field: string;
  }[];

  rows?: any[];

  items?: {
    label: string;
    value: any;
  }[];
}
