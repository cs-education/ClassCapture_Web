'use strict';

angular.module('classCaptureApp')
  .factory('encoder', function ($base64) {
    // Custom encoder used to obfuscate public facing data
    // Code is minified so don't need to worry as much...this is temporary solition though
    // Eventually, we want to be doing the encoding/decoding on backend. For now this is the quickest solution
    return {
      'encode': str => {
        // Encoding pipeline
        return [
          JSON.stringify,
          $base64.encode,
          encodeURIComponent
        ].reduce((str, encodingFunc) => {
          return encodingFunc(str);
        }, str);
      },
      'decode': str => {
        // Decoding pipeline
        return [
          decodeURIComponent,
          $base64.decode,
          JSON.parse,
        ].reduce((str, decodingFunc) => {
          return decodingFunc(str);
        });
      }
    };
  });
