import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../../shared/models/search';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {
  @Input() videos: Video[];
  @Output() loadMore: EventEmitter<string> = new EventEmitter<string>();
  @Output() download: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  emitLoadMore(event) {
    this.loadMore.emit(event);
  }

  emitDownload(videoId) {
    this.download.emit(videoId);
  }

  videoTrackBy(index: number, video: Video) {
    return video.videoId;
  }
}