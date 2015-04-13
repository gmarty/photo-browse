define((require, module, exports) => {

require('little-browser/lib/runtime');

var threads = require('threads');

var debug = 1 ? console.log.bind(console,'[views/results]') : () => {};
var client = threads.client('photo-service');
var mainEl = document.getElementById('main');
var start = Date.now();

client.call('start', { query: 'Hello Kitty' }).then(function(urls) {
  debug('got urls', Date.now() - start + 'ms', urls);
  urls.forEach(function(url) {
    var div = document.createElement('div');
    div.setAttribute('class', 'thumbnail');
    div.setAttribute('style', `background:url(${url}) center/cover`);
    mainEl.appendChild(div);
  });
});

});
