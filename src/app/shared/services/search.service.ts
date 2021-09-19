import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  getVideos(query: string, nextPageToken?: string): Observable<any> {
    if (query === null || query.length === 0) {
      return of({});
    }

    let url = `${environment.youtubeApiUrl}?q=${query}&key=${environment.youtubeApiKey}&part=snippet&type=video&maxResults=10`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`
    }
    return this.http.get(url)
      .pipe(
        map((response: any) => response)
      );
  }
}
