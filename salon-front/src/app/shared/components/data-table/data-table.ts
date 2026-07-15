import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../core/models/table-column';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = []; // Ces données sont DÉJÀ paginées par le serveur
  @Input() loading = false;
  @Input() sortable = true;
  @Input() canEdit = true;

  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // La pagination est contrôlée par le parent
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() showUnitButton = false;

  @Input() selectable = false;
  @Input() selectionMode: 'single' | 'multiple' = 'single';
  @Input() selected: any[] = [];
  @Input() showRecipeButton = false;

  @Output() openUnites = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() recipe = new EventEmitter<any>();
  @Output() selectedChange = new EventEmitter<any[]>();

  changePage(newPage: number) {
    // Vérification de sécurité avant d'émettre
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.page) {
      this.pageChange.emit(newPage);
    }
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getValue(row: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], row);
  }

  get displayedData(): any[] {
    if (!this.sortField) {
      return this.data;
    }

    return [...this.data].sort((a, b) => {
      const av = a[this.sortField];
      const bv = b[this.sortField];

      if (av == null) return 1;
      if (bv == null) return -1;

      const result = String(av).localeCompare(String(bv), 'fr', { numeric: true, sensitivity: 'base' });

      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  sort(column: string) {
    if (!this.sortable) {
      return;
    }
    if (this.sortField === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column;
      this.sortDirection = 'asc';
    }
  }

  isLowStock(row: any) {
    return row.stock !== undefined && row.stock <= row.stock_minimum;
  }

  toggle(row: any) {
    if (!this.selectable) {
      return;
    }

    if (this.selectionMode === 'single') {
      this.selected = [row];
    } else {
      const exists = this.selected.some(x => x.id === row.id);

      this.selected = exists ? this.selected.filter(x => x.id !== row.id) : [...this.selected, row];
    }

    this.selectedChange.emit(this.selected);
  }

  isSelected(row: any) {
    return this.selected.some(x => x.id === row.id);
  }
}
