import VideoGallery from '../com/video-gallery/index';
import $ from 'jquery';

$(document).ready(function () {
  new VideoGallery(document.getElementById('video-gallery'), {
    playerElem: document.getElementById('video-player'),
    descriptionElem: document.getElementById('video-description')
  });
});