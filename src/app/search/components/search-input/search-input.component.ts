import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  emitSearch(event) {
    console.log(event);
    this.search.emit(event.detail.value);
  }

  ngOnInit() {
  }
}
