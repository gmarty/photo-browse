// define((require, exports, module) => {
// 'use strict';

// var threads = require('threads');

threads.manager({
  'photo-service': {
    src: 'js/services/photo.js',
    type: 'worker'
  }
});

// });