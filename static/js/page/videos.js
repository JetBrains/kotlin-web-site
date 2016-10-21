var VideoGallery = require('../com/video-gallery');
var $ = require('jquery');

$(document).ready(function () {
  $.getJSON("/data/videos.json", function (videos) {
    new VideoGallery(document.getElementById('video-gallery'), {
      playerElem: document.getElementById('video-player'),
      descriptionElem: document.getElementById('video-description'),
      data: videos
    });
  });
});