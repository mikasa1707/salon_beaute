import { Type } from "@angular/core";
import { TableColumn } from "../../../core/models/table-column";

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
  columns: TableColumn[];
}
