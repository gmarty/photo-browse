'use strict';

importScripts('../../bower_components/threads/threads.js');


threads.service('photo-service', {
  search: function(params) {
    return flickrApi({
      method: 'flickr.photos.search',
      page: params.page || 1,
      per_page: params.per_page || 100,
      text: params.query
    }).then(result => {
      return parse(result.photos.photo);
    });
  },

  getPhoto: function(id) {
    return new Promise((resolve, reject) => {
      Promise.all([
        flickrApi({
          method: 'flickr.photos.getInfo',
          photo_id: id
        }),

        flickrApi({
          method: 'flickr.photos.getSizes',
          photo_id: id
        })
      ]).then(result => {
        var photo = result[0].photo;
        var sizes = result[1].sizes.size;
        photo.thumb = getSrc(photo);
        photo.url = sizes[sizes.length-4].source;
        photo.sizes = sizes;
        resolve(photo);
      }, reject);
    });
  }
});

function flickrApi(params) {
  return new Promise((resolve, reject) => {
    var API_KEY = '3addea8aee8a56e58cf2aa729b436970';
    var url = 'https://api.flickr.com/services/rest/?api_key=' + API_KEY + '&format=json&nojsoncallback=1';

    // Bolt-on params
    for (var key in params) url += '&' + key + '=' + params[key];

    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.overrideMimeType('application/json');
    xhr.setRequestHeader('Accept', 'application/json,text/javascript,*/*;q=0.01');

    xhr.onload = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    };

    xhr.onerror = reject;
    xhr.send();
  });
}

/**
 * Utils
 */

function parse(photos) {
  return photos
    .map(function(photo) {
      return {
        id: photo.id,
        url: getSrc(photo)
      };
    });
}

function getSrc(photo) {
  return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`;
}
