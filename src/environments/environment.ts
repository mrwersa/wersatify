// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  socketIoUrl: 'http://localhost:3001',
  fileApiUrl: 'http://localhost:3001/files/',
  youtubeApiUrl: 'https://www.googleapis.com/youtube/v3/search',
  // youtubeApiKey: 'AIzaSyD0UE0X89HdW8mrjbSNJwQ5D3a5l4mwCsY',
  youtubeApiKey: 'AIzaSyAO1odpeNGvuTl4KtUgE64lEAsGI3pHPuw'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
