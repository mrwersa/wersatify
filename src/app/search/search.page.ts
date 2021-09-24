import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { FileService } from 'src/app/shared/services/file.service';
import { Video } from 'src/app/shared/models/search';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  private videos: Video[] = [];
  private nextPageToken = '';
  private q = '';
  private socketConnected: boolean = false;

  constructor(
    private searchService: SearchService,
    private fileService: FileService,
    private socket: Socket) { }

  async ngOnInit() {
    this.socket.connect();

    this.socket.on("connect", () => {
      console.log("socket connected");
      this.socketConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("socket disconnected");
      this.socketConnected = false;
    });

    this.socket.fromEvent('download-completed').subscribe((videoId: string) => {
      console.log("download completed: " + videoId);
      const itemIndex = this.videos.findIndex(
        (video) => video.videoId === videoId
      );

      this.fileService.storeFile(videoId)
        .then(entry => {
          console.log('File saved: ' + entry.toURL());
          if (itemIndex >= 0) {
            this.videos[itemIndex].status = 'downloaded';
          }    
          this.fileService.setFileMetadata(videoId, 'downloaded');
        }, (error) => {
          console.log("Filed couldn't be saved: " + error.source);
          if (itemIndex >= 0) {
            this.videos[itemIndex].status = 'downloaded';
          }    
          this.fileService.setFileMetadata(videoId, 'not-downloaded');
        })
    });

    this.socket.fromEvent('download-error').subscribe((videoId: string) => {
      console.log(videoId);
      const itemIndex = this.videos.findIndex(
        (video) => video.videoId === videoId
      );
      if (itemIndex >= 0) {
        this.videos[itemIndex].status = 'not-downloaded';
      }
      this.fileService.setFileMetadata(videoId, 'not-downloaded');
    });
  }

  onSearch(inputValue: string) {
    this.q = inputValue;
    this.nextPageToken = '';
    this.loadVideos(false);
  }

  onDownload(videoId: string) {
    const itemIndex = this.videos.findIndex(
      (video) => video.videoId === videoId
    );

    if (this.socketConnected && itemIndex >= 0) {
      this.videos[itemIndex].status = 'being-downloaded';
      this.socket.emit('start-download', videoId);
      this.fileService.setFileMetadata(videoId, 'being-downloaded');
    } else {
      // show error message
    }
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
            let metadata = await this.fileService.getFileMetadata(item.id.videoId)

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
              status: metadata ? metadata.status : 'not-downloaded',
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
