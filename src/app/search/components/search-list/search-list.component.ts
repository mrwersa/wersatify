import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../../shared/models/search';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent {
  @Input() videos: Video[];
  @Output() onLoadMore: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDownload: EventEmitter<string> = new EventEmitter<string>();

  emitOnLoadMore(event) {
    this.onLoadMore.emit(event);
  }

  emitOnDownload(videoId) {
    this.onDownload.emit(videoId);
  }

  videoTrackBy(index: number, video: Video) {
    return video.videoId;
  }
}
