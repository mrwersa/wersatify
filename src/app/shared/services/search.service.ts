import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_TOKEN = 'AIzaSyDWpTIymf_yKIauWK9rDSJ0jR84lwlKEhA';

  constructor(private http: HttpClient) { }

  getVideos(query: string, nextPageToken?: string): Observable<any> {
    if (query === null || query.length === 0) {
      return of({});
    }

    var url = `${this.API_URL}?q=${query}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=10`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`
    }
    return this.http.get(url)
      .pipe(
        map((response: any) => response)
      );
  }
}
