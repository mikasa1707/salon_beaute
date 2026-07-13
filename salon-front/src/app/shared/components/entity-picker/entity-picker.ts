import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ModalComponent } from '../modal/modal';
import { EntityPickerConfig } from './entity-picker.model';
import { DataTableSelectable } from '../data-table-selectable/data-table-selectable';

@Component({
  selector: 'app-entity-picker',
  standalone: true,
  imports: [CommonModule, ModalComponent, DataTableSelectable],
  templateUrl: './entity-picker.html',
  styleUrl: './entity-picker.scss',
})
export class EntityPicker {
  @Input() config!: EntityPickerConfig;
  @Input() selected: any[] = [];

  @Output() selectedChange = new EventEmitter<any[]>();

  constructor(private cdr: ChangeDetectorRef) {}

  showModal = false;
  loading = false;
  items: any[] = [];
  page = 1;
  limit = 10;
  search = '';

  open(): void {
    this.showModal = true;

    this.load();
  }

  close(): void {
    this.showModal = false;
  }

  load(): void {
    if (!this.config?.service) {
      return;
    }

    this.loading = true;

    this.config.service.findAll(this.page, this.limit, this.search).subscribe({
      next: (res: any) => {
        this.items = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;
      },
    });
  }
  
  validate(): void {
    this.selectedChange.emit(this.selected);

    this.close();
  }
}
