define(['com/events-table'], function (EventsTable) {

    return function (elem, data) {
        $(document).ready(function () {
            new EventsTable(elem, data);
        });
    };

});