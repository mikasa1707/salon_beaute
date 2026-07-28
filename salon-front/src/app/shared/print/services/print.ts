import { Injectable } from '@angular/core';

import { PrintDocument } from '../models/print-document';
import { ExcelRendererService } from './excel-renderer';
import { HtmlRendererService } from './html-renderer';
import { PdfRendererService } from './pdf-renderer';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor(
    private readonly htmlRenderer: HtmlRendererService,
    private readonly pdfRenderer: PdfRendererService,
    private readonly excelRenderer: ExcelRendererService
  ) {}

  preview(document: PrintDocument) {
    const html = this.htmlRenderer.render(document);

    const win = window.open('', '_blank');

    if (!win) return;

    win.document.write(html);

    win.document.close();
  }

  print(document: PrintDocument) {
    const html = this.htmlRenderer.render(document);

    const win = window.open('', '_blank');

    if (!win) return;

    win.document.write(html);

    win.document.close();

    win.print();
  }

  pdf(document: PrintDocument) {
    this.pdfRenderer.generate(document);
  }

  excel(document: PrintDocument) {
    this.excelRenderer.generate(document);
  }
}
