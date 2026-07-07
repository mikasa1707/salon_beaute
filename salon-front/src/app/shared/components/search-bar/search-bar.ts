import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search-bar.html'
})
export class SearchBarComponent {
  search = '';
  private searchSubject = new Subject<string>();

  @Output() searchChange = new EventEmitter<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.searchChange.emit(value);
    });
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onSearch() {
    this.searchChange.emit(
      this.search
    );
  }

  clear() {
    this.search = '';
    this.onSearch();
  }

}