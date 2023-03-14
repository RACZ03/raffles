// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIUrl: 'https://restbackend.luckypro.win',
  dtOptions: {
    pagingType: "simple_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      destroy: true,
      responsive: true,
      dom: 'rtip',
      searching: true,
      search: false,
      info: false,
      language: {
        paginate: {
          first: "Primero",
          last: "Último",
          previous: "<",
          next: ">",
        }
      }
  },
  imageUrl: 'https://firebasestorage.googleapis.com/v0/b/lucky-pro-10285.appspot.com/o/lucky%2FLogoRifa.png?alt=media&token=0985e37c-790c-4332-a18c-89eec2b40e28',
  firebaseConfig: {
    apiKey: 'AIzaSyDAReprzlLOUHgvJo_yAl418YYQtw4O8YE',
    authDomain: "lucky-pro-10285.firebaseapp.com",
    projectId: "lucky-pro-10285",
    storageBucket: "lucky-pro-10285.appspot.com",
    messagingSenderId: "347068035001",
    appId: "1:347068035001:web:d9aa7ee415ca2ca4695068",
    measurementId: "G-NEQWSYYT3S"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
