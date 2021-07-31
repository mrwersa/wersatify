import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { Video } from 'src/app/shared/models/search';
import { Socket } from 'ngx-socket-io';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  private videos: Video[] = [];
  private nextPageToken = '';
  private q = '';

  constructor(
    private searchService: SearchService,
    private socket: Socket,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.socket.connect();

    this.socket.fromEvent('download-completed').subscribe((data) => {
      console.log(data);
      const itemIndex = this.videos.findIndex(
        (video) => video.videoId === data
      );
      this.videos[itemIndex].status = 'downloaded';
    });
  }

  onSearch(inputValue: string) {
    this.q = inputValue;
    this.nextPageToken = '';
    this.loadVideos(false);
  }

  onDownload(videoId: string) {
    this.socket.emit('start-download', videoId);
    const itemIndex = this.videos.findIndex(
      (video) => video.videoId === videoId
    );
    this.videos[itemIndex].status = 'being-downloaded';
  }

  onLoadMore(event: any) {
    if (this.q === null || this.q.length === 0) {
      event.target.complete();
    } else {
      setTimeout(() => {
        this.loadVideos(true, event);
      }, 500);
    }
  }

  private async loadVideos(isLoadMore: boolean, event?: any) {
    // search for videos
    this.searchService
      .getVideos(this.q, this.nextPageToken)
      .subscribe(async (response: any) => {
        const newVideos: Video[] = [];
        if (Object.keys(response).length > 0) {
          for (const item of response.items) {
            newVideos.push({
              title: item.snippet.title,
              videoId: item.id.videoId,
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              channelId: item.snippet.channelId,
              channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
              channelTitle: item.snippet.channelTitle,
              description: item.snippet.description,
              publishedAt: new Date(item.snippet.publishedAt),
              thumbnail: item.snippet.thumbnails.high.url,
              status: (await this.storage.get(item.id.videoId))
                ? 'downloaded'
                : 'not-downloaded',
            });
          }

          this.nextPageToken = response.nextPageToken;
        }

        // set results
        if (isLoadMore) {
          this.videos = this.videos.concat(newVideos);
          event.target.complete();
        } else {
          this.videos = newVideos;
        }
      });
  }
}
