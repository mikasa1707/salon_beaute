import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal';
import { EntityPickerConfig } from './entity-picker.model';
import { PaginationComponent } from '../pagination/pagination';
import { DataTableComponent } from '../data-table/data-table';

@Component({
  selector: 'app-entity-picker',
  standalone: true,
  imports: [CommonModule, ModalComponent, PaginationComponent, DataTableComponent],
  templateUrl: './entity-picker.html',
  styleUrl: './entity-picker.scss',
})
export class EntityPicker implements OnChanges {
  @Input() config!: EntityPickerConfig;
  @Input() selected: any[] = [];
  @Input() refreshKey = 0;
  @Input() page = 1;
  @Input() totalPages = 1;

  @Output() selectedChange = new EventEmitter<any[]>();

  showModal = false;
  loading = false;
  items: any[] = [];
  limit = 10;
  total = 0;
  search = '';

  constructor(private cdr: ChangeDetectorRef) {}

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
    this.config.service.findAll(this.page, this.limit, this.search).subscribe({
      next: (res: any) => {
        this.items = res.data;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(page: number) {
    this.page = page;
    this.load();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.load();
  }

  validate(): void {
    this.selectedChange.emit(this.selected);
    this.close();
  }
}
