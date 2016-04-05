define([
    'jquery',
    'jcarousel'
], function($)
{
    function Carousel(config) {
        var that = this,
            $wrapElem,
            $carousel;

        that._elem = config.elem;

        $wrapElem = $(that._elem);
        $carousel = $wrapElem.find('.js-carousel');

        $carousel.jcarousel({
            list: '.js-carousel-list'
        });

        $wrapElem.find('.js-carousel-nav-prev')
            .jcarouselControl({
                target: '-=1'
            })
            .on('jcarouselcontrol:active', function () {
                $(this).removeClass('is_disabled');
            })
            .on('jcarouselcontrol:inactive', function () {
                $(this).addClass('is_disabled');
            });

        $wrapElem.find('.js-carousel-nav-next')
            .jcarouselControl({
                target: '+=1'
            })
            .on('jcarouselcontrol:active', function () {
                $(this).removeClass('is_disabled');
            })
            .on('jcarouselcontrol:inactive', function () {
                $(this).addClass('is_disabled');
            });
    }

    Carousel.prototype._elem = null;

    return Carousel;
});