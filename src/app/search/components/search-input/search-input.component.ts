import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  emitOnSearch(event) {
    this.onSearch.emit(event.detail.value);
  }
}
