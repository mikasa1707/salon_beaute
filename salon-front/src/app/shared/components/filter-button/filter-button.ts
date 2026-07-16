import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterOption {
  id: number | string;
  label: string;
}

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-button.html',
  styleUrl: './filter-button.scss',
})
export class FilterButtonComponent {
  @Input() label = 'Filtrer';
  @Input() options: FilterOption[] = [];

  // false = un seul choix
  // true = plusieurs choix
  @Input() multiple = false;

  @Output()
  filterChange = new EventEmitter<FilterOption[]>();

  showMenu = false;

  selected: FilterOption[] = [];

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  select(option: FilterOption) {
    const exists = this.selected.some(x => x.id === option.id);

    if (this.multiple) {
      if (exists) {
        this.selected = this.selected.filter(x => x.id !== option.id);
      } else {
        this.selected.push(option);
      }
    } else {
      this.selected = exists ? [] : [option];

      this.showMenu = false;
    }

    this.emit();
  }

  remove(option: FilterOption) {
    this.selected = this.selected.filter(x => x.id !== option.id);

    this.emit();
  }

  clear() {
    this.selected = [];

    this.emit();
  }

  emit() {
    this.filterChange.emit(this.selected);
  }
}
