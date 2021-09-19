import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(
    private storage: Storage,
    private file: File,
    private fileTransfer: FileTransfer) { }

  public async getFileMetadata(videoId: string) {
    return this.storage.get(videoId);
  }

  public async setFileMetadata(videoId: string, status: string) {
    return this.storage.set(videoId, { status: status });
  }

  public async storeFile(videoId: string) {
    let url = environment.fileApiUrl + videoId;
    return this.fileTransfer.create().download(url, this.file.dataDirectory + `${videoId}.mp3`);
  }
}
