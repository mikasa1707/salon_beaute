import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintDocument } from '../../models/print-document';
import { PrintService } from '../../services/print';


@Component({
  selector: 'app-print-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-preview.html',
})
export class PrintPreviewComponent {
  @Input()
  document?: PrintDocument;
  constructor(private readonly printService: PrintService) {}

  print() {
    if (!this.document) return;

    this.printService.print(this.document);
  }

  pdf() {
    if (!this.document) return;

    this.printService.pdf(this.document);
  }

  excel() {
    if (!this.document) return;

    this.printService.excel(this.document);
  }
}
