
var debug = 1 ? console.log.bind(console,'[views/results]') : () => {};
var client = threads.client('photo-service');
var mainEl = document.getElementById('main');
var start = Date.now();

function loadPhotos() {
  mainEl.innerHTML = '';

  var query = parseQuery(location.search).query;

  if (!query) return;

  client.call('search', { query: query, per_page: 20 }).then(function(photos) {
    debug('got photos', Date.now() - start + 'ms', photos);
    photos.forEach(function(photo) {
      var a = document.createElement('a');
      var img = document.createElement('img');

      a.className = 'thumbnail';
      a.href = 'views/detail?id=' + photo.id;
      img.src = photo.url;
      img.onload = imageLoaded;

      a.appendChild(img);
      mainEl.appendChild(a);
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
