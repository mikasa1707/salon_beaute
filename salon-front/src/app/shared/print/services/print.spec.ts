import { Injectable } from '@angular/core';
import { PrintDocument } from '../models/print-document';
import { ExcelRendererService } from './excel-renderer';
import { PdfRendererService } from './pdf-renderer';
import { HtmlRendererService } from './html-renderer';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor(
    private html: HtmlRendererService,
    private pdfService: PdfRendererService,
    private excelService: ExcelRendererService
  ) {}

  preview(document: PrintDocument) {
    const html = this.html.render(document);

    const win = window.open('', '_blank');

    if (!win) return;

    win.document.write(`

<html>

<head>

<link href="
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
" rel="stylesheet">


</head>


<body class="p-4">

${html}

</body>


</html>

`);

    win.document.close();
  }

  print(document: PrintDocument) {
    const html = this.html.render(document);
    const win = window.open('');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
  }

  pdf(document: PrintDocument) {
    this.pdfService.generate(document);
  }

  excel(document: PrintDocument) {
    this.excelService.generate(document);
  }
}
