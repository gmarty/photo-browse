// define((require, exports, module) => {
'use strict';

// Loading custom-elements async causes FOUC.
// We should work out a nice way to have
// registerElement run as fast as possible.
// require('little-browser/lib/little-browser');
// require('gaia-header');

// require('./threads-manager');

var debug = 0 ? console.log.bind(console,'[app]') : () => {};
var browser = document.querySelector('little-browser');
var header = document.querySelector('gaia-header');
var title = document.querySelector('gaia-header h1');

if (!location.hash) location.hash = '#/search/index.html';

addEventListener('hashchange', updateWebview);
browser.addEventListener('metadata', onPageChanged);

function updateWebview() {
  debug('update web view');
  var url = getViewUrl();
  browser.navigate(url);
  debug('navigated webview', url);
}

function getViewUrl() {
  var hash = location.hash.replace('#/', '');
  return [
    location.protocol + '//',
    location.hostname,
    location.port ? ':' + location.port : '',
    '/views/',
    hash
  ].join('');
}

function onPageChanged(e) {
  var metadata = e.detail;
  var path = pathname(browser.src);
  debug('page changed', metadata, browser.src, path);
  title.textContent = metadata.title;
  updateHeaderAction(metadata.navigation);
  setUrl(path);
}

function updateHeaderAction(data) {
  debug('update header action', data);
  var type = data && data.type;
  header.action = type;
  header.removeEventListener('action', header.onaction);
  if (!type) return;
  header.onaction = () => setUrl(data.link);
  header.addEventListener('action', header.onaction);
}

function setUrl(url) {
  location.hash = '/' + url.replace('views/', '');
}

// Initial page
updateWebview();


function pathname(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.pathname.replace(location.pathname, '');
}

// });
