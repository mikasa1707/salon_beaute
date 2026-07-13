import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-table-selectable',
  standalone: true,
  imports: [],
  templateUrl: './data-table-selectable.html',
})
export class DataTableSelectable {
  @Input()
  columns: any[] = [];

  @Input()
  data: any[] = [];

  @Input()
  mode: 'single' | 'multiple' = 'single';

  @Input()
  selected: any[] = [];

  @Output()
  selectedChange = new EventEmitter<any[]>();

  toggle(row: any) {
    if (this.mode === 'single') {
      this.selected = [row];
    } else {
      const exists = this.selected.some(x => x.id === row.id);

      if (exists) {
        this.selected = this.selected.filter(x => x.id !== row.id);
      } else {
        this.selected = [...this.selected, row];
      }
    }

    this.selectedChange.emit(this.selected);
  }

  isSelected(row: any) {
    return this.selected.some(x => x.id === row.id);
  }
}
