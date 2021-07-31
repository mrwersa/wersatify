import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private storage: Storage,
    private file: File) { }

  public async getFileMetadata(videoId: string) {
    return this.storage.get(videoId);
  }

  public async setFileMetadata(videoId: string, name: string, status: string) {
    return this.storage.set(videoId, { name: name, status: status });
  }

  public async storeFile(videoId: string) {
    return this.file.createFile(this.file.dataDirectory, `${videoId}.mp3`, true);
  }
}
