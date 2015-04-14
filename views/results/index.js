define((require, module, exports) => {

require('little-browser/lib/runtime');
require('gaia-loading');

var threads = require('threads');

var debug = 1 ? console.log.bind(console,'[views/results]') : () => {};
var client = threads.client('photo-service');
var mainEl = document.getElementById('main');
var start = Date.now();

function loadPhotos() {
  mainEl.innerHTML = '';

  var query = parseQuery(location.search).query;

  if (!query) return;

  client.call('getPhotos', { query: query }).then(function(urls) {
    debug('got urls', Date.now() - start + 'ms', urls);
    urls.forEach(function(url) {
      var div = document.createElement('div');
      var img = document.createElement('img');

      div.className = 'thumbnail';
      img.src = url;
      img.onload = imageLoaded;

      div.appendChild(img);
      mainEl.appendChild(div);
    });
  });
}

function imageLoaded(e) {
  e.target.classList.add('loaded');
}

addEventListener('pushstate', loadPhotos);

// Initial load
loadPhotos();

/**
 * Utils
 */

function parseQuery(query) {
  var result = {};
  var parts = query
    .replace('?', '')
    .split('&');

  parts.forEach(part => {
    part = part.split('=');
    result[part[0]] = part[1];
  });

  return result;
}

});
