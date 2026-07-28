import { PrintSection } from "./print-section";

export interface PrintDocument {
  title: string;
  subtitle?: string;
  date?: Date;
  sections: PrintSection[];
}