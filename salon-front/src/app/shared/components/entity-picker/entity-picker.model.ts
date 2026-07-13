import { Type } from "@angular/core";

export interface EntityPickerConfig<T = any> {
  title: string;
  service: {
    findAll: (page?: number, limit?: number, search?: string) => any;
    create?: (data: any) => any;
    update?: (id: number, data: any) => any;
  };
  multiple?: boolean;
  allowCreate?: boolean;
  allowEdit?: boolean;
  createComponent?: Type<any>;
//   tableColumns?: Column[];
  selectorLabel?: string;
  columns: {
    field: string;
    label: string;
    type?: string;
  }[];
}
