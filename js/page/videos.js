define(['com/video-gallery'], function(VideoGallery) {

    return function(data) {
        new VideoGallery(data.elem, {
            playerElem: data.playerElem,
            descriptionElem: data.descriptionElem,
            data: data.videos
        });
    };

});