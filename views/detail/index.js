
var debug = 1 ? console.log.bind(console,'[views/detail]') : () => {};
var client = threads.client('photo-service');
var els = {
  title: document.querySelector('.title'),
  image: document.querySelector('.image')
};

function loadPhoto() {
  var id = parseQuery(location.search).id;

  if (!id) return;

  debug('load photo', id);
  loadingStart();
  client.call('getPhoto', id).then(function(photo) {
    debug('got photo', photo);
    render(photo);
  });
}

function loadingStart() {
  document.body.classList.add('loading');
}

function loadingStop() {
  document.body.classList.remove('loading');
}

function render(photo) {
  els.image.src = photo.url;
  els.image.onload = imageLoaded;
  els.title.textContent = photo.title._content;
}

function imageLoaded(e) {
  e.target.classList.add('loaded');
  loadingStop();
}

addEventListener('pushstate', loadPhoto);

// Initial load
loadPhoto();

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
