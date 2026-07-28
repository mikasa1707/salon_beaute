import { PrintColumn } from './print-column';

export interface PrintTable {
  title?: string;
  columns: PrintColumn[];
  rows: any[];
}