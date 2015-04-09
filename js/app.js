'use strict';

require(['bower_components/threads/threads'], function(threads) {
  threads.manager({
    'photo-service': {
      src: 'js/services/photo.js',
      type: 'worker'
    }
  });

  var client = threads.client('photo-service');
  var mainEl = document.getElementById('main');

  client.call('start').then(function(urls) {
    urls.forEach(function(url) {
      var div = document.createElement('div');
      div.setAttribute('class', 'thumbnail');
      div.setAttribute('style', `background:url(${url}) center/cover`);
      mainEl.appendChild(div);
    });
  });
});
