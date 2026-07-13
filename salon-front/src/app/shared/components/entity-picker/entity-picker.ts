import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ModalComponent } from '../modal/modal';
import { EntityPickerConfig } from './entity-picker.model';
import { DataTableSelectable } from '../data-table-selectable/data-table-selectable';

@Component({
  selector: 'app-entity-picker',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    DataTableSelectable,
  ],
  templateUrl: './entity-picker.html',
  styleUrl: './entity-picker.scss',
})
export class EntityPicker implements OnChanges {

  @Input() config!: EntityPickerConfig;
  @Input() selected: any[] = [];
  @Input() refreshKey = 0;

  @Output() selectedChange = new EventEmitter<any[]>();

  showModal = false;
  loading = false;
  items: any[] = [];
  page = 1;
  limit = 10;
  search = '';

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshKey'] && !changes['refreshKey'].firstChange) {
      this.load();
    }
  }


  open(): void {
    this.showModal = true;
    this.load();
  }


  close(): void {
    this.showModal = false;
  }


  reload(): void {
    this.load();
  }


  load(): void {
    if (!this.config?.service) {
      return;
    }
    this.loading = true;
    this.config.service
      .findAll(this.page, this.limit, this.search)
      .subscribe({
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