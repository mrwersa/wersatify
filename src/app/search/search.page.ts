import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { Video } from 'src/app/shared/models/search';
import { Socket } from 'ngx-socket-io';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage implements OnInit {
  private videos: Video[] = [];
  private nextPageToken = '';
  private q = '';

  constructor(private searchService: SearchService, private socket: Socket, private storage: Storage) { }

  async ngOnInit() {
    await this.storage.create();
    this.socket.connect();

    this.socket.fromEvent('download-completed').subscribe(data => {
      console.log(data);
      let itemIndex = this.videos.findIndex(video => video.videoId === data);
      this.videos[itemIndex].status = "downloaded";
    });
  }

  handleSearch(inputValue: string) {
    this.q = inputValue;
    this.nextPageToken = '';
    this.getVideos(false);
  }

  onDownload(videoId) {
    this.socket.emit('start-download', videoId);
    let itemIndex = this.videos.findIndex(video => video.videoId === videoId);
    this.videos[itemIndex].status = "being-downloaded";
  }

  onLoadMore(event) {
    if (this.q === null || this.q.length === 0) {
      event.target.complete();
    } else {
      setTimeout(() => {
        this.getVideos(true, event);
      }, 500);
    }
  }

  getVideos(isLoadMore: boolean, event?: any) {
    this.searchService.getVideos(this.q, this.nextPageToken)
      .subscribe((response: any) => {
        var newVideos: Video[] = []
        if (Object.keys(response).length > 0) {
          newVideos = response.items.map(item => {
            return {
              title: item.snippet.title,
              videoId: item.id.videoId,
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              channelId: item.snippet.channelId,
              channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
              channelTitle: item.snippet.channelTitle,
              description: item.snippet.description,
              publishedAt: new Date(item.snippet.publishedAt),
              thumbnail: item.snippet.thumbnails.high.url,
              status: this.getVideoStatus(item.id.videoId)
            };
          });
          this.nextPageToken = response.nextPageToken;
        }
        if (isLoadMore) {
          this.videos = this.videos.concat(newVideos);
          event.target.complete();
        } else {
          this.videos = newVideos;
        }
      });
  }

  getVideoStatus(videoId: string): string {
    console.log(this.getVideoFileName(videoId));
    if (this.getVideoFileName(videoId)) {
      return "downloaded";
    } else {
      return "downloaded"
    }
  }
  async getVideoFileName(videoId) {
    let videoFileName = <string>await this.storage.get(videoId);
    console.log(videoFileName);
    return videoFileName;
  }
}
