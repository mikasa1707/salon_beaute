import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';

import pdfFonts from 'pdfmake/build/vfs_fonts';

import { PrintDocument } from '../models/print-document';

(pdfMake as any).vfs = pdfFonts['vfs'];

@Injectable({
  providedIn: 'root',
})
export class PdfRendererService {
  generate(document: PrintDocument) {
    const content: any[] = [];

    content.push({
      text: document.title,

      style: 'header',
    });

    document.sections.forEach(section => {
      if (section.title) {
        content.push({
          text: section.title,

          style: 'subheader',
        });
      }

      if (section.type === 'TABLE') {
        content.push({
          table: {
            headerRows: 1,

            body: [section.columns?.map(c => c.label), ...(section.rows ?? []).map(row => section.columns?.map(c => row[c.field] ?? ''))],
          },
        });
      }
    });

    pdfMake
      .createPdf({
        content,

        styles: {
          header: {
            fontSize: 18,

            bold: true,
          },

          subheader: {
            fontSize: 14,

            bold: true,
          },
        },
      })
      .download(`${document.title}.pdf`);
  }
}
