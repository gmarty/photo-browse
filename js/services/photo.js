'use strict';

importScripts('../../bower_components/threads/threads.js');

const API_KEY = '3addea8aee8a56e58cf2aa729b436970';

threads.service('photo-service', {
  start: function(params) {
    return new Promise(function(resolve, reject) {
      var errorHandler = function(status) {
        console.log('There was an error in receiving data.', status);
        reject(false);
      };

      var url = createUrl(params.query);
      var xhr = new XMLHttpRequest();

      xhr.open('get', url, true);
      xhr.responseType = 'json';
      xhr.overrideMimeType('application/json');
      xhr.setRequestHeader('Accept', 'application/json,text/javascript,*/*;q=0.01');
      xhr.onload = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var urls = parse(xhr.response.photos.photo);
          resolve(urls);
        } else {
          errorHandler(xhr.status);
        }
      };
      xhr.onerror = errorHandler;
      xhr.send();
    });
  }
});

function createUrl(query) {
  return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${encodeURI(query)}&format=json&nojsoncallback=1`;
}

function parse(photos) {
  return photos
    .map(function(photo) {
      return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`;
    });
}
