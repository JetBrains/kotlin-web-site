define([
    'jquery'
], function ($) {
    var mapElement = document.getElementById("map");
    var myEventsData;

    window.initMap = function () {
        var map = new google.maps.Map(mapElement, {
            center: {
                lat: 20,
                lng: 0
            },
            zoom: 2
        });

        myEventsData.forEach(function (event) {
            if (event.geo === undefined) return;

            new google.maps.Marker({
                position: new google.maps.LatLng(event.geo.lat, event.geo.lng),
                map: map,
                icon: "/assets/images/favicon.ico"
            })
        });
    };

    return function (eventsData) {
        myEventsData = eventsData;
        if (mapElement != null) {
            $.getScript("https://maps.googleapis.com/maps/api/js?callback=initMap")
        }
    }
});