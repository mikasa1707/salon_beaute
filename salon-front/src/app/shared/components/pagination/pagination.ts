import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.html'
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

  constructor(private cdr: ChangeDetectorRef) { }

  // ngOnChanges() {
  //   this.pages = this.generatePages();
  //   this.cdr.detectChanges();
  // }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  generatePages() {
    const pages = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    this.cdr.detectChanges();
    return pages;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.pageChange.emit(page);
    this.cdr.detectChanges();
  }

  changeLimit(value: string) {
    this.limitChange.emit(Number(value));
    this.cdr.detectChanges();
  }
}