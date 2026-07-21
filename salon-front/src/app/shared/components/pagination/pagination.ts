import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  Math = Math;
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() total = 0;
  @Input() limit = 10;
  @Input() showLimit = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef) {}

  pages: (number | string)[] = [];

  ngOnChanges() {
    this.generatePages();
  }

  generatePages() {
    const total = this.totalPages;
    const current = this.page;

    if (total <= 6) {
      this.pages = Array.from({ length: total }, (_, i) => i + 1);
      return;
    }

    const result: (number | string)[] = [];

    // Toujours première page
    result.push(1);

    // Zone autour de la page courante
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    // Ajouter ...
    if (start > 2) {
      result.push('...');
    }

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    // Ajouter ...
    if (end < total - 1) {
      result.push('...');
    }

    // Toujours dernière page
    result.push(total);

    this.pages = result;
  }

  changePage(value: number | string) {
    if (typeof value === 'string') {
      return;
    }

    if (value < 1 || value > this.totalPages) {
      return;
    }

    this.pageChange.emit(value);
  }

  changeLimit(value: string) {
    this.limitChange.emit(Number(value));
    this.cdr.detectChanges();
  }
}
