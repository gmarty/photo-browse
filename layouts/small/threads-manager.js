/*global threads*/

threads.manager({
  'photo-service': {
    src: 'services/photo.js',
    type: 'worker'
  }
});
