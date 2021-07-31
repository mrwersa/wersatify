import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  emitSearch(event) {
    this.search.emit(event.detail.value);
  }
}
