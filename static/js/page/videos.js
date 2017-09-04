import VideoGallery from '../com/video-gallery';
import $ from 'jquery';

$(document).ready(function () {
  $.getJSON("/data/videos.json", function (videos) {
    new VideoGallery(document.getElementById('video-gallery'), {
      playerElem: document.getElementById('video-player'),
      descriptionElem: document.getElementById('video-description'),
      data: videos
    });
  });
});