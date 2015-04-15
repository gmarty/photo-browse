(function(exports) {

var debug = 0 ? console.log.bind(console,'[app]') : () => {};

function App() {
  this.els = {
    browser: document.querySelector('little-browser'),
    title: document.querySelector('gaia-header h1'),
    header: document.querySelector('gaia-header')
  };

  // Make sure there's a view path fragment
  if (!location.hash) location.hash = '/search/';

  this.els.browser.addEventListener('navigate', this.updateWindow.bind(this));
  this.els.browser.addEventListener('changed', this.onPageChanged.bind(this));
  addEventListener('hashchange', this.updateBrowser.bind(this));
  this.updateBrowser();
}

App.prototype.onPageChanged = function(e) {
  var metadata = e.detail;
  debug('page changed', metadata);
  this.els.title.textContent = metadata.title;
  document.title = metadata.title;
  this.updateHeaderAction(metadata.navigation);
};

App.prototype.updateHeaderAction = function(nav) {
  debug('update header action', nav);
  var type = nav && nav.type;
  var header = this.els.header;

  header.action = type;
  header.removeEventListener('action', header.onaction);

  if (!type) return;

  header.onaction = () => {
    if (nav.link === 'back()') this.back();
    else this.navigate(nav.link);
  };

  header.addEventListener('action', header.onaction);
};

App.prototype.navigate = function(url) {
  var absolute = parseUrl(url).absolute;
  this.els.browser.navigate(absolute);
};

App.prototype.back = function(url) {
  this.els.browser.back();
};

App.prototype.forward = function(url) {
  this.els.browser.forward();
};

App.prototype.updateWindow = function() {
  var parsed = parseUrl(this.els.browser.src);
  var fragment = parsed.pathname.replace('views/', '') + parsed.search;
  location.hash = fragment.replace('/index.html', '');
};

App.prototype.updateBrowser = function() {
  this.navigate(getViewUrl());
};

/**
 * Utils
 */

function getViewUrl() {
  var hash = location.hash.replace('#/', '');
  return location.origin + '/views/' + hash;
}

function parseUrl(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    full: url,
    absolute: a.href,
    origin: a.origin,
    pathname: a.pathname,
    search: a.search,
    hash: a.hash,
    file: a.origin + a.pathname,
    hashless: a.origin + a.pathname + a.search
  };
}

exports.app = new App();

})(window);