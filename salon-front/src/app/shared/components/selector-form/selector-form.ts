import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-selector-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './selector-form.html',
  styleUrl: './selector-form.scss',
})
export class SelectorForm {
  @Input() title = '';
  @Input() items: any[] = [];
  @Input() type: 'checkbox' | 'radio' = 'checkbox';
  @Input() labelField = 'nom';
  @Input() valueField = 'id';
  @Input() limit = 10;
  @Input() selected: any[] | number | null = [];
  @Input() valueMode: 'id' | 'object' = 'id';

  @ContentChild(TemplateRef) itemTemplate?: TemplateRef<any>;

  @Output() selectedChange = new EventEmitter<any>();

  searchText = '';
  page = 1;

  isChecked(item: any): boolean {
    if (this.type === 'radio') {
      if (this.valueMode === 'id') {
        return this.selected === item[this.valueField];
      }

      return (this.selected as any)?.[this.valueField] === item[this.valueField];
    }

    if (this.valueMode === 'id') {
      return (this.selected as any[])?.includes(item[this.valueField]);
    }

    return (this.selected as any[])?.some(x => x[this.valueField] === item[this.valueField]);
  }

  toggle(item: any): void {
    const value = this.valueMode === 'id' ? item[this.valueField] : item;

    if (this.type === 'radio') {
      this.selectedChange.emit(value);

      return;
    }

    let values = [...((this.selected as any[]) || [])];

    if (this.valueMode === 'id') {
      if (values.includes(value)) {
        values = values.filter(x => x !== value);
      } else {
        values.push(value);
      }
    } else {
      const exists = values.some(x => x[this.valueField] === item[this.valueField]);

      if (exists) {
        values = values.filter(x => x[this.valueField] !== item[this.valueField]);
      } else {
        values.push(item);
      }
    }

    this.selectedChange.emit(values);
  }

  changePage(page: number) {
    this.page = page;
  }

  get filteredCount(): number {
    if (!this.searchText) {
      return this.items.length;
    }

    return this.items.filter(item =>
      String(item[this.labelField]).toLowerCase().includes(this.searchText.toLowerCase()),
    ).length;
  }

  get filteredItems() {
    let data = this.items;

    if (this.searchText) {
      data = data.filter(item => String(item[this.labelField]).toLowerCase().includes(this.searchText.toLowerCase()));
    }

    const start = (this.page - 1) * this.limit;

    return data.slice(start, start + this.limit);
  }

  get totalPages() {
    return Math.ceil(this.filteredCount / this.limit);
  }
}
