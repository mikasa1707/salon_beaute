import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

import { PrintDocument } from '../models/print-document';

@Injectable({
  providedIn: 'root',
})
export class ExcelRenderer {
  export(document: PrintDocument) {
    const workbook = XLSX.utils.book_new();

    document.sections.forEach((section, index) => {
      if (section.type !== 'TABLE') return;

      const rows: any[] = [];

      // header

      rows.push(section.columns?.map(c => c.label));

      // data

      section.rows?.forEach(row => {
        rows.push(section.columns?.map(c => row[c.field] ?? ''));
      });

      const sheet = XLSX.utils.aoa_to_sheet(rows);

      XLSX.utils.book_append_sheet(
        workbook,

        sheet,

        section.title ?? `Sheet${index + 1}`
      );
    });

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(
      blob,

      `${document.title}.xlsx`
    );
  }
}
